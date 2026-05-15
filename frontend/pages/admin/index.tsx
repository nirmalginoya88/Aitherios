import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AnalyticsData } from '@/types';
import api from '@/lib/api';
import { staggerContainer, fadeUp, scalePop } from '@/lib/motion-variants';
import { ChartSkeleton } from '@/components/ui/Skeleton';

const getKpiCards = (kpis: any) => [
  {
    label: 'Total Revenue',
    value: `$${(kpis.totalRevenue / 1000).toFixed(1)}K`,
    growth: kpis.revenueGrowth,
    icon: <DollarSign size={20} />,
    color: 'crimson',
  },
  {
    label: 'Total Orders',
    value: kpis.totalOrders?.toLocaleString(),
    growth: kpis.ordersGrowth,
    icon: <ShoppingCart size={20} />,
    color: 'blue',
  },
  {
    label: 'Visitors',
    value: `${(kpis.totalVisitors / 1000).toFixed(1)}K`,
    growth: kpis.visitorsGrowth,
    icon: <Users size={20} />,
    color: 'purple',
  },
  {
    label: 'Conversion',
    value: `${kpis.conversionRate}%`,
    growth: kpis.conversionGrowth,
    icon: <Activity size={20} />,
    color: 'emerald',
  },
];

const COLOR_MAP: Record<string, string> = {
  crimson: '#FF0000',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  emerald: '#10b981',
};

const PIE_COLORS = ['#FF0000', '#cc0000', '#660000', '#3a3a3a', '#1a1a1a'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 rounded-lg text-xs text-white border border-white/10">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 999 ? `$${(p.value / 1000).toFixed(1)}K` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <ChartSkeleton className="h-32 rounded-2xl" />
            <ChartSkeleton className="h-32 rounded-2xl" />
            <ChartSkeleton className="h-32 rounded-2xl" />
            <ChartSkeleton className="h-32 rounded-2xl" />
          </div>
          <ChartSkeleton className="h-72 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartSkeleton className="lg:col-span-2 h-64 rounded-2xl" />
            <ChartSkeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { kpis, revenue, orders, topProducts, trafficSources } = data;
  const KPI_CARDS = getKpiCards(kpis);

  return (
    <>
      <Head>
        <title>Analytics Dashboard – Aitherios Admin</title>
        <meta name="description" content="Aitherios admin analytics dashboard." />
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
            <h1 className="font-display font-bold text-2xl text-white">Analytics Dashboard</h1>
            <p className="text-sm text-steel-300 mt-1">
              Last 12 months · Updated live
            </p>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {KPI_CARDS.map((kpi) => {
              const isPositive = kpi.growth > 0;
              const accentColor = COLOR_MAP[kpi.color];
              return (
                <motion.div
                  key={kpi.label}
                  variants={scalePop}
                  className="glass rounded-2xl p-5 space-y-3"
                  style={{ borderLeft: `3px solid ${accentColor}` }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-steel-300 font-display tracking-widest uppercase">
                      {kpi.label}
                    </p>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${accentColor}15`, color: accentColor }}
                    >
                      {kpi.icon}
                    </div>
                  </div>
                  <p className="font-display font-bold text-3xl text-white">{kpi.value}</p>
                  <div className="flex items-center gap-1.5">
                    {isPositive ? (
                      <TrendingUp size={13} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={13} className="text-red-400" />
                    )}
                    <span
                      className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {isPositive ? '+' : ''}{kpi.growth}%
                    </span>
                    <span className="text-xs text-steel-400">vs last year</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Revenue Chart */}
          <motion.div variants={fadeUp} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-white">Revenue Overview</h2>
              <span className="text-xs text-steel-400 font-display tracking-wider uppercase">2026</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenue} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#707070', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#707070', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Revenue"
                  stroke="#FF0000"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#FF0000', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bottom row: Top products + Traffic sources */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top products */}
            <motion.div variants={fadeUp} className="lg:col-span-2 glass rounded-2xl p-6">
              <h2 className="font-display font-bold text-lg text-white mb-6">Top Products</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topProducts} margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#707070', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#707070', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" name="Sales" fill="#FF0000" radius={[4, 4, 0, 0]} opacity={0.9} />
                  <Bar dataKey="revenue" name="Revenue" fill="#660000" radius={[4, 4, 0, 0]} opacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Traffic sources */}
            <motion.div variants={fadeUp} className="glass rounded-2xl p-6">
              <h2 className="font-display font-bold text-lg text-white mb-6">Traffic Sources</h2>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {trafficSources.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {trafficSources.map((s: any, i: number) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-steel-300">{s.name}</span>
                    </div>
                    <span className="text-white font-semibold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Orders trend */}
          <motion.div variants={fadeUp} className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-white mb-6">Order Volume</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={orders} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#707070', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#707070', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Orders"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#ordersGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </AdminLayout>
    </>
  );
}
