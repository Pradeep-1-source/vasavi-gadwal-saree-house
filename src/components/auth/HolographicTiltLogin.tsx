import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './holographic-login.css';

interface HolographicTiltLoginProps {
  onSuccess?: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const HolographicTiltLogin: React.FC<HolographicTiltLoginProps> = ({
  onSuccess,
  initialMode = 'login',
}) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  // Form Mode & State
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [theme, setTheme] = useState<'theme-vasavi' | 'theme-royal' | 'theme-emerald' | 'theme-sunset' | 'theme-neon' | 'theme-aurora'>('theme-vasavi');
  const [showPassword, setShowPassword] = useState(false);

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 3D Tilt Engine (requestAnimationFrame cursor tracking)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const MAX_TILT = 7; // Gentle premium 3D tilt degree
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * 2 * MAX_TILT;
      const rx = (0.5 - py) * 2 * MAX_TILT;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });
    };

    const handlePointerLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    };

    if (window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('pointermove', handlePointerMove);
        card.removeEventListener('pointerleave', handlePointerLeave);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (authMode === 'login') {
        const res = await signIn({ email, password });
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials');
        } else {
          setSuccessMsg('Namaste! Welcome back to Vasavi Saree House.');
          setTimeout(() => onSuccess?.(), 700);
        }
      } else if (authMode === 'register') {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await signUp({
          email,
          password,
          fullName: fullName.trim(),
          phone: phone.trim(),
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed');
        } else {
          setSuccessMsg('Account created successfully! Welcome to our heritage.');
          setTimeout(() => onSuccess?.(), 700);
        }
      } else if (authMode === 'forgot') {
        const res = await resetPassword(email);
        if (!res.success) {
          setErrorMsg(res.error || 'Failed to send reset link.');
        } else {
          setSuccessMsg('Password reset instructions sent to your email.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="holo-stage">
        <div ref={cardRef} className={`holo-card ${theme}`} id="card" tabIndex={-1}>
          
          {/* Layer 1: Soft drifting aurora */}
          <div className="holo-layer holo-aurora" aria-hidden="true">
            <span className="holo-blob holo-blob-a" />
            <span className="holo-blob holo-blob-b" />
            <span className="holo-blob holo-blob-c" />
          </div>

          {/* Layer 2: Rotating rays masked to edges */}
          <div className="holo-layer holo-rings" aria-hidden="true" />

          {/* Layer 3: Glass Panel */}
          <div className="holo-layer holo-panel" />

          {/* Layer 4: Animated Border Beam */}
          <div className="holo-layer holo-beam" aria-hidden="true" />

          {/* Layer 5: Holographic Sheen */}
          <div className="holo-layer holo-sheen" aria-hidden="true" />

          {/* Layer 6: Reveal Plane (Form Content) */}
          <div className="holo-reveal">
            
            {/* Header / Title */}
            <div className="holo-title">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[11px] uppercase tracking-widest text-[#E5C158] font-medium">
                    Vasavi Gadwal Saree House
                  </span>
                </div>
                <h2>
                  {authMode === 'login' && 'Sign In'}
                  {authMode === 'register' && 'Create Account'}
                  {authMode === 'forgot' && 'Reset Password'}
                </h2>
              </div>
              <div className="holo-icon-badge">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2.5 shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              
              {/* Register Fields */}
              {authMode === 'register' && (
                <>
                  <div className="holo-field">
                    <input
                      id="holo-name"
                      type="text"
                      placeholder=" "
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <label htmlFor="holo-name">Full Name</label>
                    <User className="holo-field-icon w-4 h-4" />
                  </div>

                  <div className="holo-field">
                    <input
                      id="holo-phone"
                      type="tel"
                      placeholder=" "
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label htmlFor="holo-phone">Phone Number (10 digits)</label>
                    <Phone className="holo-field-icon w-4 h-4" />
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="holo-field">
                <input
                  id="holo-email"
                  type="email"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
                <label htmlFor="holo-email">Email or Admin Username</label>
                <Mail className="holo-field-icon w-4 h-4" />
              </div>

              {/* Password Field */}
              {authMode !== 'forgot' && (
                <div className="holo-field">
                  <input
                    id="holo-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <label htmlFor="holo-password">Password</label>
                  <Lock className="holo-field-icon w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="holo-toggle-pw"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="holo-submit"
              >
                <span>
                  {loading
                    ? 'Authenticating...'
                    : authMode === 'login'
                    ? 'Enter Store'
                    : authMode === 'register'
                    ? 'Create My Account'
                    : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Links Group */}
              <div className="flex items-center justify-between mt-5 text-xs text-stone-300">
                {authMode === 'login' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[#E5C158] hover:underline font-semibold"
                    >
                      New customer? Sign up
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[#E5C158] hover:underline font-semibold"
                    >
                      ← Back to Sign In
                    </button>
                    {authMode === 'forgot' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="text-stone-400 hover:text-white"
                      >
                        Register
                      </button>
                    )}
                  </>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Holographic Themes Switcher */}
      <div className="holo-themes" role="group" aria-label="Holographic Theme">
        <button
          onClick={() => setTheme('theme-vasavi')}
          className={theme === 'theme-vasavi' ? 'active' : ''}
          style={{ ['--sw1' as any]: '#D4AF37', ['--sw2' as any]: '#801A2D' }}
          title="Vasavi Royal Gold & Maroon"
        />
        <button
          onClick={() => setTheme('theme-royal')}
          className={theme === 'theme-royal' ? 'active' : ''}
          style={{ ['--sw1' as any]: '#c9a227', ['--sw2' as any]: '#9b5cff' }}
          title="Royal Gold & Purple"
        />
        <button
          onClick={() => setTheme('theme-emerald')}
          className={theme === 'theme-emerald' ? 'active' : ''}
          style={{ ['--sw1' as any]: '#22e3a3', ['--sw2' as any]: '#7dff9b' }}
          title="Emerald Weave"
        />
        <button
          onClick={() => setTheme('theme-sunset')}
          className={theme === 'theme-sunset' ? 'active' : ''}
          style={{ ['--sw1' as any]: '#ff6a3d', ['--sw2' as any]: '#ffd166' }}
          title="Sunset Zari"
        />
        <button
          onClick={() => setTheme('theme-neon')}
          className={theme === 'theme-neon' ? 'active' : ''}
          style={{ ['--sw1' as any]: '#ff2770', ['--sw2' as any]: '#45f3ff' }}
          title="Neon Glow"
        />
        <button
          onClick={() => setTheme('theme-aurora')}
          className={theme === 'theme-aurora' ? 'active' : ''}
          style={{ ['--sw1' as any]: '#8a5cff', ['--sw2' as any]: '#3ad6ff' }}
          title="Aurora Silk"
        />
      </div>
    </div>
  );
};
