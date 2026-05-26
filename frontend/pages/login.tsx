import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Zap, KeyRound, ChevronLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Input } from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import { fadeUp, scalePop } from '@/lib/motion-variants';

// Step types for the forgot password flow
type ForgotStep = 'email' | 'otp' | 'newpass' | 'done';

// ─── Main Page ────────────────────────────────────────────────
export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  // Login form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // ── Login submit ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot flow handlers ────────────────────────────────────
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    // Mock: simulate network delay then proceed
    await new Promise(r => setTimeout(r, 1200));
    setForgotLoading(false);
    setForgotStep('otp');
    setOtpValue(['', '', '', '']);
    setOtpError('');
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  const handleOtpInput = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpValue];
    next[idx] = val;
    setOtpValue(next);
    setOtpError('');
    if (val && idx < 3) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValue[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValue.join('');
    if (entered !== '1234') {
      setOtpError('Incorrect code. Hint: it\'s 1234 😉');
      return;
    }
    setForgotStep('newpass');
    setNewPass('');
    setConfirmPass('');
    setPassError('');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) { setPassError('Password must be at least 6 characters.'); return; }
    if (newPass !== confirmPass) { setPassError('Passwords do not match.'); return; }
    setForgotLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setForgotLoading(false);
    setForgotStep('done');
  };

  const resetForgotFlow = () => {
    setShowForgot(false);
    setForgotStep('email');
    setForgotEmail('');
    setOtpValue(['', '', '', '']);
    setOtpError('');
    setPassError('');
    setNewPass('');
    setConfirmPass('');
  };

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-crimson-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login | Aitherios</title>
        <meta name="description" content="Sign in to your Aitherios account to manage orders, profile, and more." />
      </Head>

      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crimson-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 bg-crimson-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-widest uppercase text-white">Aitherios</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ═══ Login Card ═══ */}
          {!showForgot && (
            <motion.div
              key="login"
              variants={scalePop}
              initial="hidden"
              animate="visible"
              exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.15 } }}
              className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-crimson-500/20 blur-[60px] rounded-full pointer-events-none" />

              <div className="mb-8 text-center relative z-10">
                <h1 className="font-display font-bold text-3xl text-white mb-2">Welcome Back</h1>
                <p className="text-zinc-400 text-sm">Enter your credentials to access your account.</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center relative z-10"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="zara@example.com"
                  icon={<Mail size={16} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                {/* Password with show/hide toggle */}
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-3 text-zinc-400 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setForgotEmail(email); }}
                    className="text-xs text-zinc-400 hover:text-crimson-400 transition-colors font-display"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={loading}>
                  Sign In <ArrowRight size={16} />
                </Button>
              </form>

              <div className="mt-8 text-center relative z-10 pt-6 border-t border-white/5">
                <p className="text-sm text-zinc-400">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-crimson-400 font-bold hover:text-crimson-300 transition-colors">
                    Sign Up
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ═══ Forgot Password Card ═══ */}
          {showForgot && (
            <motion.div
              key="forgot"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.15 } }}
              className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-crimson-500/15 blur-[60px] rounded-full pointer-events-none" />

              <AnimatePresence mode="wait">

                {/* ── Step 1: Enter email ── */}
                {forgotStep === 'email' && (
                  <motion.div key="step-email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
                    <button
                      onClick={resetForgotFlow}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white mb-6 transition-colors font-display"
                    >
                      <ChevronLeft size={14} /> Back to login
                    </button>
                    <div className="mb-8 text-center">
                      <div className="w-14 h-14 bg-crimson-500/10 border border-crimson-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail size={24} className="text-crimson-500" />
                      </div>
                      <h2 className="font-display font-bold text-2xl text-white mb-2">Forgot Password?</h2>
                      <p className="text-zinc-400 text-sm">Enter your registered email and we'll send you a verification code.</p>
                    </div>
                    <form onSubmit={handleSendCode} className="space-y-4">
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="zara@example.com"
                        icon={<Mail size={16} />}
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        autoFocus
                      />
                      <Button type="submit" variant="primary" size="lg" className="w-full" loading={forgotLoading}>
                        Send Verification Code
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* ── Step 2: Enter OTP ── */}
                {forgotStep === 'otp' && (
                  <motion.div key="step-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
                    <button
                      onClick={() => setForgotStep('email')}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white mb-6 transition-colors font-display"
                    >
                      <ChevronLeft size={14} /> Back
                    </button>
                    <div className="mb-8 text-center">
                      <div className="w-14 h-14 bg-crimson-500/10 border border-crimson-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <KeyRound size={24} className="text-crimson-500" />
                      </div>
                      <h2 className="font-display font-bold text-2xl text-white mb-2">Check Your Email</h2>
                      <p className="text-zinc-400 text-sm">
                        We sent a 4-digit code to{' '}
                        <span className="text-white font-medium">{forgotEmail}</span>
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      {/* OTP digit boxes */}
                      <div className="flex gap-3 justify-center">
                        {otpValue.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={otpRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpInput(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className={`
                              w-14 h-14 text-center text-2xl font-display font-bold rounded-xl
                              bg-white/5 border-2 transition-all duration-200 focus:outline-none
                              text-white
                              ${otpError ? 'border-red-500/60 bg-red-500/5' : digit ? 'border-crimson-500 bg-crimson-500/10' : 'border-white/10 focus:border-crimson-500'}
                            `}
                            aria-label={`OTP digit ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {otpError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-sm text-red-400"
                        >
                          {otpError}
                        </motion.p>
                      )}

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={otpValue.some(d => !d)}
                      >
                        Verify Code
                      </Button>

                      <p className="text-center text-xs text-zinc-500">
                        Didn't receive the code?{' '}
                        <button
                          type="button"
                          className="text-crimson-400 hover:text-crimson-300 transition-colors"
                          onClick={() => { setOtpValue(['', '', '', '']); setOtpError(''); }}
                        >
                          Resend
                        </button>
                      </p>
                    </form>
                  </motion.div>
                )}

                {/* ── Step 3: New Password ── */}
                {forgotStep === 'newpass' && (
                  <motion.div key="step-newpass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
                    <button
                      onClick={() => setForgotStep('otp')}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white mb-6 transition-colors font-display"
                    >
                      <ChevronLeft size={14} /> Back
                    </button>
                    <div className="mb-8 text-center">
                      <div className="w-14 h-14 bg-crimson-500/10 border border-crimson-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={24} className="text-crimson-500" />
                      </div>
                      <h2 className="font-display font-bold text-2xl text-white mb-2">New Password</h2>
                      <p className="text-zinc-400 text-sm">Choose a strong new password for your account.</p>
                    </div>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <Input
                        label="New Password"
                        type="password"
                        placeholder="Min. 6 characters"
                        icon={<Lock size={16} />}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                        autoFocus
                      />
                      <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Re-enter your password"
                        icon={<Lock size={16} />}
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        required
                      />
                      {passError && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400">
                          {passError}
                        </motion.p>
                      )}
                      <Button type="submit" variant="primary" size="lg" className="w-full" loading={forgotLoading}>
                        Reset Password
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* ── Step 4: Done ── */}
                {forgotStep === 'done' && (
                  <motion.div
                    key="step-done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle size={36} className="text-green-400" />
                    </motion.div>
                    <h2 className="font-display font-bold text-2xl text-white mb-3">Password Reset!</h2>
                    <p className="text-zinc-400 text-sm mb-8">
                      Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={resetForgotFlow}
                    >
                      Back to Sign In <ArrowRight size={16} />
                    </Button>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Return to Home
          </Link>
        </motion.div>
      </div>
    </>
  );
}
