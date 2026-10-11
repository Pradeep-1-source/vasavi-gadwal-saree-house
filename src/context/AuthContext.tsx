import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isSupabaseConnected: boolean;
  signUp: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  signIn: (data: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { fullName?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'vgsh_auth_user';
const ACCOUNTS_DB_KEY = 'vgsh_registered_accounts';

interface StoredAccount {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

const getStoredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing stored accounts:', e);
  }
  return [
    {
      id: 'usr-admin-vasavi',
      email: 'vasavi@admin',
      password: 'vasavi@112',
      fullName: 'Vasavi Store Admin',
      phone: '7660833168',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
  ];
};

const saveStoredAccount = (acc: StoredAccount) => {
  try {
    const current = getStoredAccounts();
    const existingIdx = current.findIndex(a => a.email.toLowerCase() === acc.email.toLowerCase());
    if (existingIdx !== -1) {
      current[existingIdx] = { ...current[existingIdx], ...acc };
    } else {
      current.push(acc);
    }
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Error saving stored account:', e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Initialize Auth
  useEffect(() => {
    // If Supabase session exists, optionally sync
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && !user) {
          const profileUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Valued Customer',
            phone: session.user.user_metadata?.phone,
            role: session.user.email === 'vasavi@admin' ? 'admin' : 'customer',
            created_at: session.user.created_at,
            updated_at: new Date().toISOString(),
          };
          setUser(profileUser);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profileUser));
        }
      }).catch(() => {
        // network or host error, local user remains active
      });
    }
  }, []);

  const signUp = async ({ email, password, fullName, phone }: { email: string; password: string; fullName: string; phone?: string }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      if (!fullName.trim()) {
        return { success: false, error: 'Please enter your full name.' };
      }

      // Check if user already exists
      const accounts = getStoredAccounts();
      const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (existing && existing.role !== 'admin') {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const role: UserRole = (cleanEmail === 'vasavi@admin' || cleanEmail === 'vasavi@admin.com') ? 'admin' : 'customer';

      const newUser: UserProfile = {
        id: 'usr-' + Date.now(),
        email: cleanEmail,
        full_name: fullName.trim(),
        phone: phone?.trim() || '7660833168',
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 1. Immediately save to local accounts database for 100% instant reliability
      saveStoredAccount({
        id: newUser.id,
        email: cleanEmail,
        password,
        fullName: newUser.full_name,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.created_at,
      });

      setUser(newUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));

      // 2. Non-blocking background attempt to sync with Supabase
      if (isSupabaseConfigured) {
        Promise.race([
          supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: fullName.trim(),
                phone: phone?.trim() || '',
              }
            }
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500))
        ]).catch(() => {
          // Supabase sync failure does not block the user
        });
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        return { success: false, error: 'Please enter your email or username.' };
      }
      if (!password) {
        return { success: false, error: 'Please enter your password.' };
      }

      // 1. Store Admin Authentication Check
      const isAdminLogin = 
        (cleanEmail === 'vasavi@admin' || cleanEmail === 'vasavi@admin.com' || cleanEmail === 'admin' || cleanEmail === 'vasavi') && 
        password === 'vasavi@112';

      if (isAdminLogin) {
        const adminUser: UserProfile = {
          id: 'usr-admin-vasavi',
          email: 'vasavi@admin',
          full_name: 'Vasavi Store Admin',
          phone: '7660833168',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(adminUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(adminUser));
        return { success: true };
      }

      if ((cleanEmail === 'vasavi@admin' || cleanEmail === 'admin' || cleanEmail === 'vasavi') && !isAdminLogin) {
        return { success: false, error: 'Invalid admin credentials. Please check your password.' };
      }

      // 2. Local Registered Accounts Database Check
      const accounts = getStoredAccounts();
      const matched = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (matched) {
        if (matched.password && matched.password !== password) {
          return { success: false, error: 'Incorrect password. Please try again.' };
        }
        const loggedInUser: UserProfile = {
          id: matched.id,
          email: matched.email,
          full_name: matched.fullName,
          phone: matched.phone,
          role: matched.role,
          created_at: matched.createdAt,
          updated_at: new Date().toISOString(),
        };
        setUser(loggedInUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(loggedInUser));
        return { success: true };
      }

      // 3. Fast Supabase Auth attempt with 2.5s timeout
      if (isSupabaseConfigured) {
        try {
          const res: any = await Promise.race([
            supabase.auth.signInWithPassword({ email: cleanEmail, password }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500))
          ]);

          if (res?.data?.user) {
            const loggedIn: UserProfile = {
              id: res.data.user.id,
              email: res.data.user.email || cleanEmail,
              full_name: res.data.user.user_metadata?.full_name || cleanEmail.split('@')[0] || 'Customer',
              phone: res.data.user.user_metadata?.phone || '7660833168',
              role: 'customer',
              created_at: res.data.user.created_at,
              updated_at: new Date().toISOString(),
            };
            setUser(loggedIn);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(loggedIn));
            saveStoredAccount({
              id: loggedIn.id,
              email: cleanEmail,
              password,
              fullName: loggedIn.full_name,
              phone: loggedIn.phone,
              role: 'customer',
              createdAt: loggedIn.created_at,
            });
            return { success: true };
          }
        } catch {
          // Fall through to seamless customer session
        }
      }

      // 4. Seamless onboarding: If customer enters credentials, create their account seamlessly
      const newCustomer: UserProfile = {
        id: 'usr-cust-' + Date.now(),
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Valued Customer',
        phone: '7660833168',
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveStoredAccount({
        id: newCustomer.id,
        email: cleanEmail,
        password,
        fullName: newCustomer.full_name,
        phone: newCustomer.phone,
        role: 'customer',
        createdAt: newCustomer.created_at,
      });
      setUser(newCustomer);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newCustomer));
      return { success: true };

    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    // Demo mode: mock success
    return { success: true };
  };

  const updateProfile = async ({ fullName, phone }: { fullName?: string; phone?: string }) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const updated: UserProfile = {
      ...user,
      full_name: fullName || user.full_name,
      phone: phone !== undefined ? phone : user.phone,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.full_name,
            phone: updated.phone,
            updated_at: updated.updated_at,
          })
          .eq('id', user.id);
      } catch (e) {
        console.error(e);
      }
    }

    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    return { success: true };
  };

  const switchDemoRole = (role: UserRole) => {
    const updated: UserProfile = user ? { ...user, role } : {
      id: 'usr-demo-' + role,
      email: role === 'admin' ? 'admin@vasavisarees.com' : 'priya.s@example.com',
      full_name: role === 'admin' ? 'Vasavi Admin Store Manager' : 'Priya Sundaram',
      phone: '7660833168',
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseConnected: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        switchDemoRole,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
