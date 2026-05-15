import Head from 'next/head';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Mail, ShoppingBag, DollarSign,
  Calendar, Activity, Crown, UserCheck, UserX,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Badge from '@/components/ui/Badge';
import { Customer, Order } from '@/types';
import api from '@/lib/api';
import { staggerContainer, fadeUp, scalePop, overlayFade } from '@/lib/motion-variants';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

type CustomerStatus = Customer['status'];

const STATUS_CONFIG: Record<
  CustomerStatus,
  { variant: 'success' | 'default' | 'crimson'; icon: React.ReactNode; label: string }
> = {
  vip:      { variant: 'crimson',  icon: <Crown size={12} />,     label: 'VIP' },
  active:   { variant: 'success',  icon: <UserCheck size={12} />, label: 'Active' },
  inactive: { variant: 'default',  icon: <UserX size={12} />,     label: 'Inactive' },
};

const AVATAR_COLORS = [
  'bg-crimson-500/20 text-crimson-400 border-crimson-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'bg-amber-500/20 text-amber-400 border-amber-500/30',
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, ordersRes] = await Promise.all([
          api.get('/admin/customers'),
          api.get('/admin/orders')
        ]);
        setCustomers(customersRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error('Failed to fetch CRM data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getCustomerOrders = (customerId: string) =>
    orders.filter((o) => o.customerId === customerId);

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const vipCount = customers.filter((c) => c.status === 'vip').length;
  const activeCount = customers.filter((c) => c.status === 'active').length;

  return (
    <>
      <Head>
        <title>Customer Insights – Aitherios Admin</title>
        <meta name="description" content="CRM view of Aitherios customers and their activity." />
      </Head>

      <AdminLayout>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <h1 className="font-display font-bold text-2xl text-white">Customer Insights</h1>
            <p className="text-sm text-steel-300 mt-1">CRM view · {customers.length} customers</p>
          </motion.div>

          {/* KPI row */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                label: 'Total Customers',
                value: customers.length,
                icon: <Activity size={18} />,
                color: 'crimson',
              },
              {
                label: 'VIP Members',
                value: vipCount,
                icon: <Crown size={18} />,
                color: 'amber',
              },
              {
                label: 'Lifetime Revenue',
                value: `$${(totalRevenue / 1000).toFixed(1)}K`,
                icon: <DollarSign size={18} />,
                color: 'emerald',
              },
            ].map((kpi, i) => {
              const colorMap: Record<string, string> = {
                crimson: '#FF0000',
                amber: '#f59e0b',
                emerald: '#10b981',
              };
              const accent = colorMap[kpi.color];
              return (
                <motion.div
                  key={kpi.label}
                  variants={scalePop}
                  className="glass rounded-2xl p-5 flex items-center gap-4"
                  style={{ borderLeft: `3px solid ${accent}` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    {kpi.icon}
                  </div>
                  <div>
                    <p className="text-xs text-steel-300 font-display tracking-widest uppercase">
                      {kpi.label}
                    </p>
                    <p className="font-display font-bold text-2xl text-white mt-0.5">
                      {kpi.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
              <input
                type="search"
                placeholder="Search customers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-steel-400 focus:outline-none focus:border-crimson-500 transition-all"
                aria-label="Search customers"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['all', 'vip', 'active', 'inactive'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold tracking-wider uppercase capitalize transition-all ${
                    statusFilter === s
                      ? 'bg-crimson-500 text-white'
                      : 'glass text-steel-300 hover:text-white border border-white/10'
                  }`}
                  aria-pressed={statusFilter === s}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Customer Cards Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))
              ) : filtered.map((customer, i) => {
                const cfg = STATUS_CONFIG[customer.status];
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const customerOrders = getCustomerOrders(customer.id);
                return (
                  <motion.div
                    key={customer.id}
                    variants={fadeUp}
                    layout
                    className="glass rounded-2xl p-5 cursor-pointer hover:border-crimson-500/30 border border-transparent transition-all duration-300 group"
                    onClick={() => setDetailCustomer(customer)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${customer.name} details`}
                    onKeyDown={(e) => e.key === 'Enter' && setDetailCustomer(customer)}
                  >
                    {/* Avatar + Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-display font-bold text-base ${avatarColor}`}>
                        {customer.avatar}
                      </div>
                      <Badge variant={cfg.variant}>
                        <span className="flex items-center gap-1">
                          {cfg.icon} {cfg.label}
                        </span>
                      </Badge>
                    </div>

                    {/* Name + email */}
                    <h3 className="font-display font-bold text-white group-hover:text-crimson-300 transition-colors">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-steel-400 mt-0.5 flex items-center gap-1">
                      <Mail size={11} /> {customer.email}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/8">
                      {[
                        { label: 'Orders', value: customer.totalOrders },
                        { label: 'Spent', value: `$${(customer.totalSpent / 1000).toFixed(1)}K` },
                        { label: 'Joined', value: customer.joinDate.slice(0, 7) },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                          <p className="font-display font-bold text-white text-sm">{value}</p>
                          <p className="text-[10px] text-steel-400 uppercase tracking-wide mt-0.5">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Last active */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        customer.status === 'inactive' ? 'bg-steel-500' : 'bg-emerald-500 animate-pulse'
                      }`} />
                      <span className="text-xs text-steel-400">
                        Last active {customer.lastActive}
                      </span>
                    </div>

                    {/* Order count badge */}
                    {customerOrders.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-steel-400">
                        <ShoppingBag size={11} />
                        {customerOrders.length} recent order{customerOrders.length !== 1 ? 's' : ''} tracked
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {!loading && filtered.length === 0 && (
            <motion.div variants={fadeUp} className="text-center py-16">
              <Activity size={36} className="text-steel-500 mx-auto mb-3" />
              <p className="font-display font-bold text-white">No customers found</p>
            </motion.div>
          )}
        </motion.div>

        {/* ── Customer Detail Modal ───────────────────────────── */}
        <AnimatePresence>
          {detailCustomer && (
            <>
              <motion.div
                variants={overlayFade}
                initial="closed"
                animate="open"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setDetailCustomer(null)}
              >
                <motion.div
                  variants={scalePop}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-lg glass rounded-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-label="Customer profile"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const idx = customers.findIndex(c => c.id === detailCustomer.id);
                        return (
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-display font-bold ${AVATAR_COLORS[Math.max(0, idx) % AVATAR_COLORS.length]}`}>
                            {detailCustomer.avatar}
                          </div>
                        );
                      })()}
                      <div>
                        <h2 className="font-display font-bold text-white">{detailCustomer.name}</h2>
                        <p className="text-xs text-steel-400">{detailCustomer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_CONFIG[detailCustomer.status].variant}>
                        <span className="flex items-center gap-1">
                          {STATUS_CONFIG[detailCustomer.status].icon}
                          {STATUS_CONFIG[detailCustomer.status].label}
                        </span>
                      </Badge>
                      <button
                        onClick={() => setDetailCustomer(null)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-steel-300 hover:text-white hover:bg-white/5 transition-all"
                        aria-label="Close"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Total Orders', value: detailCustomer.totalOrders, icon: <ShoppingBag size={16} /> },
                        { label: 'Total Spent', value: `$${detailCustomer.totalSpent.toLocaleString()}`, icon: <DollarSign size={16} /> },
                        { label: 'Joined', value: detailCustomer.joinDate, icon: <Calendar size={16} /> },
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="glass rounded-xl p-3 text-center">
                          <div className="text-crimson-400 flex justify-center mb-1">{icon}</div>
                          <p className="font-display font-bold text-white text-sm">{value}</p>
                          <p className="text-[10px] text-steel-400 uppercase tracking-wide mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Activity timeline */}
                    <div>
                      <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-300 mb-3">
                        Order Activity
                      </h3>
                      <div className="space-y-2">
                        {getCustomerOrders(detailCustomer.id).length > 0 ? (
                          getCustomerOrders(detailCustomer.id).map((order) => (
                            <div key={order.id} className="flex items-center justify-between text-sm py-2.5 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  order.status === 'delivered' ? 'bg-emerald-500' :
                                  order.status === 'shipped' ? 'bg-blue-500' :
                                  order.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                                }`} />
                                <div>
                                  <p className="text-white font-medium">{order.id}</p>
                                  <p className="text-xs text-steel-400">{order.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold text-white">${order.total}</p>
                                <Badge variant={STATUS_CONFIG[order.status as CustomerStatus]?.variant || 'default'} className="text-[10px]">
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-steel-400 text-sm py-4 text-center">
                            No recent orders in this view
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CRM actions */}
                    <div>
                      <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-300 mb-3">
                        CRM Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Send Email',
                          'Apply Discount',
                          'Flag Account',
                          'Export Data',
                        ].map((action) => (
                          <button
                            key={action}
                            className="py-2 glass border border-white/10 rounded-lg text-xs font-display font-bold text-steel-200 hover:text-white hover:border-crimson-500/40 transition-all"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </AdminLayout>
    </>
  );
}
