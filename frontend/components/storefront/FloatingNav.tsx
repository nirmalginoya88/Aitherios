import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, User, Zap } from 'lucide-react';
import { drawerSlide, overlayFade, fadeIn } from '@/lib/motion-variants';
import CartDrawer from './CartDrawer';
import { CartItem } from '@/types';

const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/products?category=new', label: 'New Drops' },
  { href: '/products?tag=limited', label: 'Limited' },
  { href: '/dashboard', label: 'Account' },
];

interface FloatingNavProps {
  cart: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
}

export default function FloatingNav({ cart, onCartUpdate }: FloatingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.asPath]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? 'mx-4 mt-3 rounded-2xl glass shadow-glass'
            : 'glass border-b border-white/5'
          }
        `}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Aitherios home"
          >
            <div className="w-8 h-8 bg-crimson-500 rounded-lg flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg tracking-widest uppercase text-white">
              Aitherios
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    text-sm font-display font-medium tracking-wider uppercase transition-colors duration-200
                    ${router.asPath.startsWith(link.href.split('?')[0])
                      ? 'text-crimson-500'
                      : 'text-steel-200 hover:text-white'
                    }
                  `}
                  aria-current={router.asPath === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-steel-200 hover:text-white hover:bg-white/5 transition-all duration-200"
              aria-label="Search products"
            >
              <Search size={18} />
            </button>

            {/* User */}
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-lg hidden md:flex items-center justify-center text-steel-200 hover:text-white hover:bg-white/5 transition-all duration-200"
              aria-label="User account"
            >
              <User size={18} />
            </Link>

            {/* Cart FAB */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-crimson-500 text-white shadow-glow-sm hover:shadow-glow transition-shadow duration-200"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-crimson-500 text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-steel-200 hover:text-white hover:bg-white/5 transition-all"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }}>
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <>
              {/* High-Performance Motion Blur Overlay */}
              <motion.div 
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                className="fixed inset-0 z-[999] bg-black/70"
                style={{ WebkitBackdropFilter: 'blur(40px)' }}
                onClick={() => setSearchOpen(false)}
              />
              
              <motion.div
                initial={{ y: -64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -64, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed top-16 left-0 right-0 z-[60] bg-obsidian-900/90 backdrop-blur-xl border-b-2 border-crimson-500 shadow-[0_10px_40px_rgba(255,0,0,0.15)]"
              >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-4">
                  <Search size={20} className="text-crimson-500" />
                  <input
                    type="search"
                    placeholder="Search Aitherios catalog..."
                    autoFocus
                    className="flex-1 bg-transparent text-white placeholder:text-steel-500 text-xl font-display focus:outline-none"
                    aria-label="Search input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push(`/products?q=${(e.target as HTMLInputElement).value}`);
                        setSearchOpen(false);
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                  />
                  <button 
                    onClick={() => setSearchOpen(false)}
                    className="p-2 text-steel-400 hover:text-white transition-colors"
                    aria-label="Close search"
                  >
                    <X size={24} />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              variants={overlayFade}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 glass border-r border-white/8 md:hidden"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <span className="font-display font-bold text-lg tracking-widest uppercase">
                    Aitherios
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-steel-200 hover:text-white hover:bg-white/5"
                  >
                    <X size={18} />
                  </button>
                </div>
                <ul className="space-y-1 flex-1" role="list">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center px-4 py-3 rounded-xl text-steel-200 hover:text-white hover:bg-white/5 font-display font-medium tracking-wider uppercase text-sm transition-all"
                        aria-current={router.asPath === link.href ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-white/10">
                  <Link
                    href="/admin"
                    className="text-xs text-steel-400 hover:text-crimson-500 transition-colors font-display tracking-widest uppercase"
                  >
                    Admin Panel →
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onCartUpdate={onCartUpdate}
      />
    </>
  );
}
