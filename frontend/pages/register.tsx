import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Zap, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Input } from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import { fadeUp, scalePop } from '@/lib/motion-variants';

export default function RegisterPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Split full name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // fallback to firstName if no last name

      const res = await api.post('/auth/register', { firstName, lastName, email, password });
      login(res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <title>Join Aitherios | Create Account</title>
      </Head>

      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crimson-500/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8 flex flex-col items-center"
        >
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 bg-crimson-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-widest uppercase text-white">
              Aitherios
            </span>
          </Link>
        </motion.div>

        <motion.div
          variants={scalePop}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl"
        >
          {/* Subtle glow background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-crimson-500/20 blur-[60px] rounded-full pointer-events-none" />

          <div className="mb-8 text-center relative z-10">
            <h2 className="font-display font-bold text-3xl text-white mb-2">Join Aitherios</h2>
            <p className="text-steel-400 text-sm">
              Create an account to track orders and save your wishlist.
            </p>
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
              label="Full Name"
              placeholder="Zara Noctis"
              icon={<User size={16} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
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
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={loading}
            >
              Create Account <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-8 text-center relative z-10 pt-6 border-t border-white/5">
            <p className="text-sm text-steel-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-crimson-400 font-bold hover:text-crimson-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link href="/" className="text-sm text-steel-400 hover:text-white transition-colors">
            ← Return to Home
          </Link>
        </motion.div>
      </div>
    </>
  );
}
