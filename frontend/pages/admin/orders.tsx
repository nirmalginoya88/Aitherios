import Head from 'next/head';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, ChevronUp, Eye, X,
  Truck, Package, CheckCircle, Clock, XCircle,
  MapPin, Mail,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Badge from '@/components/ui/Badge';
import { Order } from '@/types';
import api from '@/lib/api';
import { staggerContainer, fadeUp, scalePop, overlayFade } from '@/lib/motion-variants';
import { useEffect } from 'react';
import { TableRowSkeleton } from '@/components/ui/Skeleton';

type OrderStatus = Order['status'];

const STATUS_CONFIG: Record<
  OrderStatus,
  { variant: 'success' | 'info' | 'warning' | 'default' | 'danger'; icon: React.ReactNode; label: string }
> = {
  delivered: { variant: 'success', icon: <CheckCircle size={13} />, label: 'Delivered' },
  shipped:   { variant: 'info',    icon: <Truck size={13} />,        label: 'Shipped' },
  processing:{ variant: 'warning', icon: <Package size={13} />,      label: 'Processing' },
  pending:   { variant: 'default', icon: <Clock size={13} />,        label: 'Pending' },
  cancelled: { variant: 'danger',  icon: <XCircle size={13} />,      label: 'Cancelled' },
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending',    label: 'Order Placed' },
  { status: 'processing', label: 'Processing' },
  { status: 'shipped',    label: 'Shipped' },
  { status: 'delivered',  label: 'Delivered' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'date' | 'total'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/admin/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      if (detailOrder?.id === id) {
        setDetailOrder((prev) => prev ? { ...prev, status } : prev);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filtered = orders
    .filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const aVal = sortField === 'date' ? new Date(a.date).getTime() : a.total;
      const bVal = sortField === 'date' ? new Date(b.date).getTime() : b.total;
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });

  const toggleSort = (field: 'date' | 'total') => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: 'date' | 'total' }) =>
    sortField === field
      ? sortDir === 'desc'
        ? <ChevronDown size={12} className="text-crimson-400" />
        : <ChevronUp size={12} className="text-crimson-400" />
      : <ChevronDown size={12} className="text-steel-500" />;

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  const getStepIndex = (status: OrderStatus) =>
    TIMELINE_STEPS.findIndex((s) => s.status === status);

  return (
    <>
      <Head>
        <title>Orders – Aitherios Admin</title>
        <meta name="description" content="Manage and track Aitherios orders." />
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
            <h1 className="font-display font-bold text-2xl text-white">Orders</h1>
            <p className="text-sm text-steel-300 mt-1">{orders.length} total orders</p>
          </motion.div>

          {/* Status summary cards */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          >
            {ALL_STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <motion.button
                  key={s}
                  variants={fadeUp}
                  onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                  className={`glass rounded-xl p-3 text-left transition-all ${
                    statusFilter === s ? 'border border-crimson-500/40 bg-crimson-500/5' : 'border border-transparent hover:border-white/10'
                  }`}
                  aria-pressed={statusFilter === s}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                  <p className="font-display font-bold text-2xl text-white">
                    {statusCounts[s]}
                  </p>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Search */}
          <motion.div variants={fadeUp} className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-400" />
            <input
              type="search"
              placeholder="Search by order ID, customer name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-steel-400 focus:outline-none focus:border-crimson-500 transition-all"
              aria-label="Search orders"
            />
          </motion.div>

          {/* Orders Table */}
          <motion.div variants={fadeUp} className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-white/8">
                    {[
                      { label: 'Order ID', field: null },
                      { label: 'Customer', field: null },
                      { label: 'Date', field: 'date' as const },
                      { label: 'Status', field: null },
                      { label: 'Total', field: 'total' as const },
                      { label: 'Actions', field: null },
                    ].map(({ label, field }) => (
                      <th
                        key={label}
                        className="text-left px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300"
                      >
                        {field ? (
                          <button
                            onClick={() => toggleSort(field)}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            {label} <SortIcon field={field} />
                          </button>
                        ) : (
                          label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td colSpan={6} className="p-0">
                            <TableRowSkeleton />
                          </td>
                        </tr>
                      ))
                    ) : filtered.map((order, idx) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                        >
                          <td className="px-4 py-3">
                            <span className="font-display font-bold text-white text-sm">
                              {order.id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-white font-medium">{order.customerName}</p>
                            <p className="text-xs text-steel-400">{order.customerEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-steel-300">{order.date}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={cfg.variant}>
                                <span className="flex items-center gap-1">
                                  {cfg.icon} {cfg.label}
                                </span>
                              </Badge>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-display font-bold text-white">${order.total}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {/* Status updater */}
                              <div className="relative">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    updateStatus(order.id, e.target.value as OrderStatus)
                                  }
                                  className="glass border border-white/10 text-white text-xs font-display rounded-lg px-2 py-1.5 pr-6 focus:outline-none focus:border-crimson-500 cursor-pointer bg-transparent appearance-none"
                                  aria-label={`Change status for ${order.id}`}
                                >
                                  {ALL_STATUSES.map((s) => (
                                    <option key={s} value={s} className="bg-obsidian-200 capitalize">
                                      {s}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-steel-400 pointer-events-none" />
                              </div>
                              <button
                                onClick={() => setDetailOrder(order)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-steel-400 hover:text-white hover:bg-white/5 transition-all"
                                aria-label={`View details for ${order.id}`}
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {!loading && filtered.length === 0 && (
                <div className="text-center py-16">
                  <Package size={36} className="text-steel-500 mx-auto mb-3" />
                  <p className="font-display font-bold text-white">No orders found</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Order Detail Modal ──────────────────────────────── */}
        <AnimatePresence>
          {detailOrder && (
            <>
              <motion.div
                variants={overlayFade}
                initial="closed"
                animate="open"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setDetailOrder(null)}
              >
                <motion.div
                  variants={scalePop}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-lg glass rounded-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-label="Order detail"
                >
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                    <div>
                      <h2 className="font-display font-bold text-white">{detailOrder.id}</h2>
                      <p className="text-xs text-steel-400">{detailOrder.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_CONFIG[detailOrder.status].variant}>
                        {STATUS_CONFIG[detailOrder.status].label}
                      </Badge>
                      <button
                        onClick={() => setDetailOrder(null)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-steel-300 hover:text-white hover:bg-white/5 transition-all"
                        aria-label="Close"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[70vh] no-scrollbar">
                    {/* Customer */}
                    <div>
                      <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-300 mb-2">
                        Customer
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-white font-medium">{detailOrder.customerName}</p>
                        <p className="text-xs text-steel-400 flex items-center gap-1">
                          <Mail size={11} /> {detailOrder.customerEmail}
                        </p>
                        <p className="text-xs text-steel-400 flex items-center gap-1">
                          <MapPin size={11} /> {detailOrder.shippingAddress}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-300 mb-3">
                        Items
                      </h3>
                      <div className="space-y-2">
                        {detailOrder.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex justify-between items-center text-sm py-2 border-b border-white/5"
                          >
                            <div>
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-xs text-steel-400">Qty: {item.qty}</p>
                            </div>
                            <span className="font-display font-bold text-white">
                              ${item.price * item.qty}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-display font-bold text-sm text-white">Total</span>
                          <span className="font-display font-bold text-crimson-400 text-lg">
                            ${detailOrder.total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipment timeline */}
                    {detailOrder.status !== 'cancelled' && (
                      <div>
                        <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-300 mb-3">
                          Shipment Progress
                        </h3>
                        <div className="space-y-3">
                          {TIMELINE_STEPS.map((step, i) => {
                            const stepIdx = getStepIndex(detailOrder.status);
                            const done = i <= stepIdx;
                            const current = i === stepIdx;
                            return (
                              <div key={step.status} className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  done ? 'border-crimson-500 bg-crimson-500/20' : 'border-steel-500'
                                }`}>
                                  {done && <CheckCircle size={14} className="text-crimson-400" />}
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${done ? 'text-white' : 'text-steel-500'}`}>
                                    {step.label}
                                  </p>
                                  {current && (
                                    <p className="text-xs text-crimson-400">In progress</p>
                                  )}
                                </div>
                                {i < TIMELINE_STEPS.length - 1 && (
                                  <div className={`absolute ml-3 w-px h-3 ${done ? 'bg-crimson-500/40' : 'bg-steel-600'}`} style={{ marginTop: '2rem' }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {detailOrder.trackingId && (
                          <p className="text-xs text-steel-300 mt-3 flex items-center gap-1.5">
                            <Truck size={12} className="text-crimson-400" />
                            Tracking: <span className="text-white font-semibold">{detailOrder.trackingId}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Update status */}
                    <div>
                      <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-300 mb-2">
                        Update Status
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(detailOrder.id, s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold capitalize transition-all ${
                              detailOrder.status === s
                                ? 'bg-crimson-500 text-white'
                                : 'glass border border-white/10 text-steel-300 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {s}
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
