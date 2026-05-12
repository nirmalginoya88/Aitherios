import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Input } from '../ui/FormElements';
import Button from '../ui/Button';
import { scalePop, overlayFade } from '@/lib/motion-variants';

export default function AuthModal() {
  const { setShowAuthModal, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Send actual login request to your backend
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token);
      } else {
        // Send registration request
        const res = await api.post('/auth/register', { name, email, password });
        login(res.data.token);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayFade}
        initial="closed"
        animate="open"
        exit="exit"
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={() => setShowAuthModal(false)}
      >
        <motion.div
          variants={scalePop}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle glow background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-crimson-500/20 blur-[60px] rounded-full pointer-events-none" />

          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 text-steel-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-8 text-center relative z-10">
            <h2 className="font-display font-bold text-3xl text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join Aitherios'}
            </h2>
            <p className="text-steel-400 text-sm">
              {isLogin
                ? 'Enter your credentials to access your account.'
                : 'Create an account to track orders and save your wishlist.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center relative z-10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="Zara Noctis"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="zara@example.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={loading}
            >
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <p className="text-sm text-steel-400">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-crimson-400 font-bold hover:text-crimson-300 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
