import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Zap, ChevronLeft, ChevronRight, ExternalLink,
  BarChart3, Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Analytics', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/inventory', label: 'Inventory', icon: <Package size={18} /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { href: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

import { useAuth } from '@/lib/auth';

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login'); // Redirect to login page instead of modal
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-obsidian-DEFAULT flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-crimson-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-DEFAULT flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 220 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 bottom-0 z-40 flex-shrink-0 flex flex-col overflow-hidden"
        style={{
          background: 'rgba(10,10,10,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
        aria-label="Admin sidebar"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/6 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex-shrink-0 bg-crimson-500 rounded-lg flex items-center justify-center shadow-glow-sm">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-display font-bold text-sm tracking-widest uppercase text-white whitespace-nowrap overflow-hidden"
                >
                  Aitherios
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Admin badge */}
        {!collapsed && (
          <div className="px-4 py-2 border-b border-white/6">
            <span className="text-[10px] font-display font-bold tracking-widest uppercase text-crimson-400 bg-crimson-500/10 border border-crimson-500/20 px-2 py-0.5 rounded-full">
              Admin Panel
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2" role="list">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-crimson-500/10 text-crimson-400 border border-crimson-500/20'
                        : 'text-steel-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-sm font-display font-semibold tracking-wide whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-crimson-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-2 pb-4 space-y-1 border-t border-white/6 pt-3">
          {!collapsed && (
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-steel-400 hover:text-white hover:bg-white/5 transition-all text-sm font-display"
            >
              <ExternalLink size={16} />
              <span className="whitespace-nowrap">View Store</span>
            </Link>
          )}
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-steel-400 hover:text-white hover:bg-white/5 transition-all w-full"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={16} />
            {!collapsed && (
              <span className="text-sm font-display whitespace-nowrap">Settings</span>
            )}
          </button>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-steel-500 hover:text-white hover:bg-white/5 transition-all w-full"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && (
              <span className="text-sm font-display whitespace-nowrap text-steel-400">Collapse</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: collapsed ? 68 : 220 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-w-0"
      >
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/6 bg-obsidian-50 sticky top-0 z-30" role="banner">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-crimson-400" />
            <span className="text-xs font-display font-bold tracking-widest uppercase text-steel-300">
              {NAV_ITEMS.find((n) => n.href === router.pathname)?.label || 'Admin'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-steel-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
            <div className="w-8 h-8 rounded-lg bg-crimson-500/10 border border-crimson-500/20 flex items-center justify-center font-display font-bold text-xs text-crimson-400">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
