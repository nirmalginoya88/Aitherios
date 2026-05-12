import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Heart, User, ChevronRight, CheckCircle,
  Clock, Truck, MapPin, Edit3, Bell,
} from 'lucide-react';
import FloatingNav from '@/components/storefront/FloatingNav';
import Footer from '@/components/storefront/Footer';
import { MOCK_PRODUCTS, CartItem } from '@/lib/mock-data';
import Badge from '@/components/ui/Badge';
import { fadeUp, staggerContainer, scalePop } from '@/lib/motion-variants';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';

type DashboardTab = 'orders' | 'wishlist' | 'profile' | 'notifications';

const TABS: { key: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { key: 'orders', label: 'Orders', icon: <Package size={17} /> },
  { key: 'wishlist', label: 'Wishlist', icon: <Heart size={17} /> },
  { key: 'profile', label: 'Profile', icon: <User size={17} /> },
  { key: 'notifications', label: 'Alerts', icon: <Bell size={17} /> },
];

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'default'> = {
  delivered: 'success',
  shipped: 'info',
  processing: 'warning',
  pending: 'default',
  cancelled: 'danger',
};

const STATUS_STEPS = ['Ordered', 'Processing', 'Shipped', 'Delivered'];

const WISHLIST_PRODUCTS = MOCK_PRODUCTS.slice(3, 7);

interface DashboardProps {
  cart: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
}

export default function Dashboard({ cart, onCartUpdate, addToCart }: DashboardProps) {
  const { user, isLoading: authLoading, setShowAuthModal } = useAuth();
  const [tab, setTab] = useState<DashboardTab>('orders');
  
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading, setShowAuthModal]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [ordersRes, wishlistRes] = await Promise.all([
            api.get('/orders/me'),
            api.get('/user/wishlist')
          ]);
          setUserOrders(ordersRes.data || []);
          setWishlist(wishlistRes.data || []);
        } catch (err) {
          console.error('Failed to fetch dashboard data', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const getStepIndex = (status: string) => {
    if (status === 'pending') return 0;
    if (status === 'processing') return 1;
    if (status === 'shipped') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-obsidian-DEFAULT flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-crimson-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Dashboard – Aitherios</title>
        <meta name="description" content="Manage your Aitherios orders, wishlist, and account settings." />
      </Head>

      <FloatingNav cart={cart} onCartUpdate={onCartUpdate} />

      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="py-10 border-b border-white/8 mb-8"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-crimson-500/10 border border-crimson-500/20 flex items-center justify-center font-display font-bold text-2xl text-crimson-400">
                {user ? user.name.substring(0, 2).toUpperCase() : '??'}
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl text-white">
                  {user ? user.name : 'Welcome'}
                </h1>
                <p className="text-steel-300 text-sm">
                  {user ? user.email : 'Please login'} · {user?.role === 'admin' ? 'Admin' : 'Member'}
                </p>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-3">
                <div className="text-center">
                  <p className="font-display font-bold text-xl text-white">{userOrders.length}</p>
                  <p className="text-xs text-steel-400 uppercase tracking-wider">Orders</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="font-display font-bold text-xl text-crimson-400">$4,820</p>
                  <p className="text-xs text-steel-400 uppercase tracking-wider">Spent</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="font-display font-bold text-xl text-white">{wishlist.length}</p>
                  <p className="text-xs text-steel-400 uppercase tracking-wider">Wishlist</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Command center grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar nav */}
            <aside className="lg:w-52 flex-shrink-0" aria-label="Dashboard navigation">
              <nav>
                <ul className="space-y-1" role="list">
                  {TABS.map((t) => (
                    <li key={t.key}>
                      <button
                        onClick={() => setTab(t.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-display font-semibold tracking-wide transition-all ${
                          tab === t.key
                            ? 'bg-crimson-500/10 text-crimson-400 border border-crimson-500/20'
                            : 'text-steel-300 hover:text-white hover:bg-white/5'
                        }`}
                        aria-selected={tab === t.key}
                        role="tab"
                      >
                        {t.icon} {t.label}
                        {tab === t.key && (
                          <ChevronRight size={14} className="ml-auto" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/8">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-display font-semibold text-steel-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Admin Panel →
                  </Link>
                </div>
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">

                {/* ── Orders ─────────────────────────────────── */}
                {tab === 'orders' && (
                  <motion.div
                    key="orders"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    role="tabpanel"
                    className="space-y-4"
                  >
                    <motion.h2 variants={fadeUp} className="font-display font-bold text-xl text-white mb-4">
                      Order History
                    </motion.h2>
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-40 w-full rounded-2xl" />
                        <Skeleton className="h-40 w-full rounded-2xl" />
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="text-center py-10 glass rounded-2xl text-steel-400">
                        <Package size={32} className="mx-auto mb-3 opacity-50" />
                        <p>No orders found.</p>
                      </div>
                    ) : userOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        variants={fadeUp}
                        className="glass rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <p className="font-display font-bold text-white">{order.id}</p>
                            <p className="text-xs text-steel-300 mt-0.5">{order.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={STATUS_VARIANT[order.status] || 'default'} pulse={order.status === 'processing' || order.status === 'shipped'}>
                              {order.status}
                            </Badge>
                            <span className="font-display font-bold text-white">${order.total}</span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-1.5">
                          {order.items?.map((item: any) => (
                            <div key={item.productId} className="flex justify-between text-sm text-steel-300">
                              <span>{item.name} ×{item.qty}</span>
                              <span className="text-white">${item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>

                        {/* Progress bar */}
                        {order.status !== 'cancelled' && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                              {STATUS_STEPS.map((s, i) => {
                                const stepIdx = getStepIndex(order.status);
                                return (
                                  <div key={s} className="flex flex-col items-center gap-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                                      i <= stepIdx ? 'border-crimson-500 bg-crimson-500/20' : 'border-steel-500'
                                    }`}>
                                      {i <= stepIdx && <CheckCircle size={13} className="text-crimson-400" />}
                                    </div>
                                    <span className={`text-[10px] font-display tracking-wider ${i <= stepIdx ? 'text-crimson-400' : 'text-steel-500'}`}>
                                      {s}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="relative h-0.5 bg-steel-500/30 mx-3">
                              <div
                                className="absolute left-0 top-0 h-full bg-crimson-500 transition-all duration-700"
                                style={{ width: `${(getStepIndex(order.status) / (STATUS_STEPS.length - 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tracking */}
                        {order.trackingId && (
                          <div className="flex items-center gap-2 text-xs text-steel-300">
                            <Truck size={13} className="text-crimson-400" />
                            <span>Tracking: {order.trackingId}</span>
                          </div>
                        )}
                        {order.shippingAddress && (
                          <div className="flex items-center gap-2 text-xs text-steel-400">
                            <MapPin size={12} />
                            <span>{order.shippingAddress}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* ── Wishlist ────────────────────────────────── */}
                {tab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    role="tabpanel"
                  >
                    <motion.h2 variants={fadeUp} className="font-display font-bold text-xl text-white mb-6">
                      Saved Items
                    </motion.h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {WISHLIST_PRODUCTS.filter((p) => wishlist.includes(p.id)).map((product) => (
                        <motion.div
                          key={product.id}
                          variants={scalePop}
                          className="glass rounded-2xl p-3 flex gap-4"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-obsidian-300 flex-shrink-0">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="80px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-sm text-white truncate">{product.name}</p>
                            <p className="text-xs text-steel-300 mt-0.5">{product.category}</p>
                            <p className="font-display font-bold text-crimson-400 mt-1">${product.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  addToCart({
                                    productId: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.images[0],
                                    qty: 1,
                                  })
                                }
                                className="text-xs px-3 py-1 bg-crimson-500 text-white rounded-lg font-display font-bold hover:bg-crimson-600 hover:shadow-glow-sm transition-all"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => setWishlist((w) => w.filter((id) => id !== product.id))}
                                className="text-xs text-steel-400 hover:text-crimson-500 transition-colors"
                                aria-label="Remove from wishlist"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {wishlist.length === 0 && (
                        <motion.div variants={fadeUp} className="col-span-2 text-center py-16">
                          <Heart size={36} className="text-steel-500 mx-auto mb-3" />
                          <p className="font-display font-bold text-white">No saved items</p>
                          <p className="text-steel-300 text-sm mt-1">Heart a product to save it here.</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── Profile ─────────────────────────────────── */}
                {tab === 'profile' && (
                  <motion.div
                    key="profile"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                    role="tabpanel"
                  >
                    <motion.h2 variants={fadeUp} className="font-display font-bold text-xl text-white">
                      Account Settings
                    </motion.h2>
                    {[
                      { label: 'Personal Info', fields: ['Full Name: Zara Noctis', 'Email: zara@example.com', 'Phone: +81-90-0000-0001'] },
                      { label: 'Shipping Address', fields: ['12 Neon Ave', 'Neo Tokyo, JP 100-001', 'Japan'] },
                      { label: 'Preferences', fields: ['Newsletter: Enabled', 'Dark Mode: On', 'Language: English'] },
                    ].map(({ label, fields }) => (
                      <motion.div key={label} variants={fadeUp} className="glass rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-display font-bold text-sm text-white uppercase tracking-widest">
                            {label}
                          </h3>
                          <button className="flex items-center gap-1 text-xs text-steel-300 hover:text-crimson-400 transition-colors">
                            <Edit3 size={12} /> Edit
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {fields.map((f) => (
                            <p key={f} className="text-sm text-steel-200">{f}</p>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* ── Notifications ───────────────────────────── */}
                {tab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                    role="tabpanel"
                  >
                    <motion.h2 variants={fadeUp} className="font-display font-bold text-xl text-white mb-4">
                      Notifications
                    </motion.h2>
                    {[
                      { icon: <Truck size={16} />, title: 'Order ORD-001 Delivered', time: '2h ago', read: false },
                      { icon: <Clock size={16} />, title: 'New drop: Void Runner X2 coming soon', time: '1d ago', read: false },
                      { icon: <CheckCircle size={16} />, title: 'Payment confirmed for ORD-006', time: '4d ago', read: true },
                      { icon: <Heart size={16} />, title: 'Cipher Hoodie back in stock', time: '5d ago', read: true },
                    ].map(({ icon, title, time, read }, i) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        className={`glass rounded-xl p-4 flex items-center gap-4 ${!read ? 'border-l-2 border-crimson-500' : ''}`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${!read ? 'bg-crimson-500/10 text-crimson-400' : 'bg-white/5 text-steel-400'}`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${!read ? 'text-white' : 'text-steel-300'}`}>{title}</p>
                          <p className="text-xs text-steel-400 mt-0.5">{time}</p>
                        </div>
                        {!read && (
                          <div className="w-2 h-2 rounded-full bg-crimson-500 flex-shrink-0 animate-pulse-glow" />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
