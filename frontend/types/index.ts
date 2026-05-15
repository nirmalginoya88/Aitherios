export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  description: string;
  images: string[];
  variants: {
    sizes?: string[];
    colors?: { name: string; hex: string }[];
  };
  featured?: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  shippingAddress: string;
  trackingId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'vip';
  avatar: string;
}

export interface AnalyticsData {
  revenue: { date: string; value: number }[];
  orders: { date: string; value: number }[];
  traffic: { date: string; value: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  trafficSources: { name: string; value: number }[];
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalVisitors: number;
    conversionRate: number;
    revenueGrowth: number;
    ordersGrowth: number;
    visitorsGrowth: number;
    conversionGrowth: number;
  };
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
}
