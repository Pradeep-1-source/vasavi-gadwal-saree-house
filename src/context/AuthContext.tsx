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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Valued Customer',
              phone: profile?.phone || session.user.user_metadata?.phone,
              role: (profile?.role as UserRole) || 'customer',
              created_at: session.user.created_at,
              updated_at: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Supabase auth session error, checking local store', err);
        }
      }

      // Check local storage if no user from Supabase
      if (!user) {
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }

      setLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const newUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Valued Customer',
            phone: profile?.phone || session.user.user_metadata?.phone,
            role: (profile?.role as UserRole) || 'customer',
            created_at: session.user.created_at,
            updated_at: new Date().toISOString(),
          };
          setUser(newUser);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_USER_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signUp = async ({ email, password, fullName, phone }: { email: string; password: string; fullName: string; phone?: string }) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone || '',
            }
          }
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email,
            full_name: fullName,
            phone,
            role: 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(newUser);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
        }
        return { success: true };
      }

      // Offline / Demo SignUp
      const newUser: UserProfile = {
        id: 'usr-' + Date.now(),
        email,
        full_name: fullName,
        phone,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const loggedIn: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || data.user.user_metadata?.full_name || 'Customer',
            phone: profile?.phone || data.user.user_metadata?.phone,
            role: (profile?.role as UserRole) || 'customer',
            created_at: data.user.created_at,
            updated_at: new Date().toISOString(),
          };
          setUser(loggedIn);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(loggedIn));
        }
        return { success: true };
      }

      // Admin credential check
      const isAdminLogin = 
        (email.trim().toLowerCase() === 'vasavi@admin' || email.trim().toLowerCase() === 'vasavi@admin.com') && 
        password === 'vasavi@112';

      if (email.trim().toLowerCase().includes('admin') && !isAdminLogin) {
        return { success: false, error: 'Invalid admin credentials.' };
      }

      const loggedInUser: UserProfile = {
        id: isAdminLogin ? 'usr-admin-vasavi' : 'usr-cust-' + Date.now(),
        email: email.trim(),
        full_name: isAdminLogin ? 'Vasavi Store Admin' : (email.split('@')[0] || 'Valued Customer'),
        phone: '7660833168',
        role: isAdminLogin ? 'admin' : 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(loggedInUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(loggedInUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
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
