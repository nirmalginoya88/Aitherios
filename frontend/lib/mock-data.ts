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

/* ─── Products ──────────────────────────────────────────────── */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'void-runner-x1',
    name: 'Void Runner X1',
    price: 299,
    originalPrice: 399,
    category: 'Footwear',
    tags: ['bestseller', 'new', 'limited'],
    rating: 4.9,
    reviews: 342,
    stock: 12,
    badge: 'BESTSELLER',
    description:
      'Engineered for the urban void. The Void Runner X1 features reactive carbon-fiber soles, adaptive mesh upper, and an anti-gravity midsole system. Performance redefined.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80',
    ],
    variants: {
      sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
      colors: [
        { name: 'Obsidian', hex: '#1a1a1a' },
        { name: 'Blood Red', hex: '#FF0000' },
        { name: 'Chrome', hex: '#c0c0c0' },
      ],
    },
    featured: true,
  },
  {
    id: 'p2',
    slug: 'phantom-jacket-v2',
    name: 'Phantom Jacket V2',
    price: 589,
    originalPrice: 749,
    category: 'Outerwear',
    tags: ['new', 'limited'],
    rating: 4.8,
    reviews: 189,
    stock: 7,
    badge: 'LIMITED',
    description:
      'Graphene-weave outer shell with thermal-adaptive inner lining. Phantom Jacket V2 disappears into the environment while making you the apex predator of any room.',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    variants: {
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Void Black', hex: '#000000' },
        { name: 'Gunmetal', hex: '#2c3e50' },
      ],
    },
    featured: true,
  },
  {
    id: 'p3',
    slug: 'neural-watch-pro',
    name: 'Neural Watch Pro',
    price: 1299,
    category: 'Accessories',
    tags: ['new', 'premium'],
    rating: 4.95,
    reviews: 98,
    stock: 24,
    badge: 'NEW',
    description:
      'The Neural Watch Pro is the first timepiece with a biometric mesh display and predictive health analytics. Titanium case, sapphire crystal, 72-hour battery autonomy.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&q=80',
    ],
    variants: {
      colors: [
        { name: 'Titanium', hex: '#878681' },
        { name: 'Obsidian', hex: '#1a1a1a' },
        { name: 'Crimson', hex: '#FF0000' },
      ],
    },
    featured: true,
  },
  {
    id: 'p4',
    slug: 'apex-cargo-pants',
    name: 'Apex Cargo Pants',
    price: 189,
    category: 'Bottoms',
    tags: ['bestseller'],
    rating: 4.7,
    reviews: 567,
    stock: 45,
    description:
      'Tactical ripstop fabric with 14-pocket utility configuration. Zero-friction waistband with magnetically sealed closures.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    ],
    variants: {
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: [
        { name: 'Stealth Black', hex: '#0a0a0a' },
        { name: 'Olive Drab', hex: '#4a4a2a' },
        { name: 'Graphite', hex: '#3a3a3a' },
      ],
    },
  },
  {
    id: 'p5',
    slug: 'ghost-tech-tee',
    name: 'Ghost Tech Tee',
    price: 89,
    category: 'Tops',
    tags: ['bestseller', 'new'],
    rating: 4.6,
    reviews: 823,
    stock: 120,
    badge: 'HOT',
    description:
      'Anti-static, moisture-wicking micro-modal blend. Laser-cut seams, zero-friction collar. The shirt that disappears so you don\'t have to.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    ],
    variants: {
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Crimson', hex: '#FF0000' },
        { name: 'Ash', hex: '#888888' },
      ],
    },
  },
  {
    id: 'p6',
    slug: 'eclipse-backpack',
    name: 'Eclipse Backpack',
    price: 349,
    originalPrice: 449,
    category: 'Bags',
    tags: ['sale', 'limited'],
    rating: 4.85,
    reviews: 234,
    stock: 18,
    badge: 'SALE',
    description:
      'Military-grade ballistic nylon shell, hidden RFID-blocking compartment, mag-lock closures, and a built-in 20,000mAh power hub.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    variants: {
      colors: [
        { name: 'Phantom Black', hex: '#0d0d0d' },
        { name: 'Stealth Red', hex: '#8b0000' },
      ],
    },
  },
  {
    id: 'p7',
    slug: 'sigma-sunglasses',
    name: 'Sigma Sunglasses',
    price: 219,
    category: 'Accessories',
    tags: ['new', 'premium'],
    rating: 4.8,
    reviews: 156,
    stock: 32,
    description:
      'Titanium frame, polarized photochromic lenses with UV-550 protection. Adjusts from clear to full dark in 45 seconds.',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    ],
    variants: {
      colors: [
        { name: 'Black', hex: '#0a0a0a' },
        { name: 'Gunmetal', hex: '#3a3a3a' },
        { name: 'Gold', hex: '#c9a84c' },
      ],
    },
  },
  {
    id: 'p8',
    slug: 'cipher-hoodie',
    name: 'Cipher Hoodie',
    price: 229,
    category: 'Tops',
    tags: ['bestseller'],
    rating: 4.9,
    reviews: 445,
    stock: 55,
    badge: 'BESTSELLER',
    description:
      'Double-layered 600gsm french terry. Kangaroo pocket with wireless charging pad. Drop-shoulder silhouette engineered for optimal movement.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
    ],
    variants: {
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      colors: [
        { name: 'Jet Black', hex: '#000000' },
        { name: 'Crimson', hex: '#FF0000' },
        { name: 'Carbon', hex: '#1c1c1c' },
      ],
    },
  },
  {
    id: 'p9',
    slug: 'spectre-belt',
    name: 'Spectre Belt',
    price: 129,
    category: 'Accessories',
    tags: ['new'],
    rating: 4.7,
    reviews: 88,
    stock: 60,
    description:
      'Full-grain leather with matte-black alloy buckle. Adjustable ratchet mechanism — zero holes, infinite precision.',
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
    ],
    variants: {
      colors: [
        { name: 'Black', hex: '#0a0a0a' },
        { name: 'Oxblood', hex: '#4a0000' },
      ],
    },
  },
  {
    id: 'p10',
    slug: 'zero-g-cap',
    name: 'Zero-G Cap',
    price: 79,
    category: 'Accessories',
    tags: ['bestseller'],
    rating: 4.6,
    reviews: 612,
    stock: 200,
    description:
      '6-panel structured cap with laser-etched Aitherios emblem. Moisture-wicking sweatband, adjustable snap-back.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    ],
    variants: {
      colors: [
        { name: 'Black/Red', hex: '#000000' },
        { name: 'All Black', hex: '#0a0a0a' },
        { name: 'Charcoal', hex: '#333333' },
      ],
    },
  },
  {
    id: 'p11',
    slug: 'axiom-sneaker',
    name: 'Axiom Sneaker',
    price: 449,
    originalPrice: 549,
    category: 'Footwear',
    tags: ['sale', 'limited'],
    rating: 4.85,
    reviews: 271,
    stock: 9,
    badge: 'SALE',
    description:
      'Full-length nitrogen-infused air unit, knit upper with heat-bonded overlays. An architectural achievement in every step.',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
    ],
    variants: {
      sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
      colors: [
        { name: 'Monochrome Black', hex: '#0a0a0a' },
        { name: 'Red Strike', hex: '#FF0000' },
      ],
    },
  },
  {
    id: 'p12',
    slug: 'arc-gloves',
    name: 'Arc Gloves',
    price: 159,
    category: 'Accessories',
    tags: ['new', 'premium'],
    rating: 4.9,
    reviews: 63,
    stock: 40,
    badge: 'NEW',
    description:
      'Touchscreen-compatible goat leather with Kevlar reinforced knuckles. Zero-bulk thermal insulation rated to -15°C.',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80',
    ],
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Black', hex: '#0a0a0a' },
        { name: 'Oxblood', hex: '#4a0000' },
      ],
    },
  },
];

/* ─── Orders ────────────────────────────────────────────────── */
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'c1',
    customerName: 'Zara Noctis',
    customerEmail: 'zara@example.com',
    date: '2026-05-10',
    status: 'delivered',
    items: [
      { productId: 'p1', name: 'Void Runner X1', qty: 1, price: 299 },
      { productId: 'p5', name: 'Ghost Tech Tee', qty: 2, price: 89 },
    ],
    total: 477,
    shippingAddress: '12 Neon Ave, Neo Tokyo, JP 100-001',
    trackingId: 'TRK-88421',
  },
  {
    id: 'ORD-002',
    customerId: 'c2',
    customerName: 'Kai Vantara',
    customerEmail: 'kai@example.com',
    date: '2026-05-11',
    status: 'shipped',
    items: [{ productId: 'p2', name: 'Phantom Jacket V2', qty: 1, price: 589 }],
    total: 589,
    shippingAddress: '44 Blacksite Rd, Berlin, DE 10115',
    trackingId: 'TRK-88422',
  },
  {
    id: 'ORD-003',
    customerId: 'c3',
    customerName: 'Nova Chen',
    customerEmail: 'nova@example.com',
    date: '2026-05-11',
    status: 'processing',
    items: [
      { productId: 'p3', name: 'Neural Watch Pro', qty: 1, price: 1299 },
      { productId: 'p7', name: 'Sigma Sunglasses', qty: 1, price: 219 },
    ],
    total: 1518,
    shippingAddress: '8 Carbon St, London, UK EC1A 1BB',
  },
  {
    id: 'ORD-004',
    customerId: 'c4',
    customerName: 'Rex Mortal',
    customerEmail: 'rex@example.com',
    date: '2026-05-12',
    status: 'pending',
    items: [{ productId: 'p8', name: 'Cipher Hoodie', qty: 2, price: 229 }],
    total: 458,
    shippingAddress: '99 Ghost Lane, NYC, US 10001',
  },
  {
    id: 'ORD-005',
    customerId: 'c5',
    customerName: 'Lyra Shade',
    customerEmail: 'lyra@example.com',
    date: '2026-05-09',
    status: 'cancelled',
    items: [{ productId: 'p6', name: 'Eclipse Backpack', qty: 1, price: 349 }],
    total: 349,
    shippingAddress: '3 Void Circle, Dubai, UAE',
  },
  {
    id: 'ORD-006',
    customerId: 'c1',
    customerName: 'Zara Noctis',
    customerEmail: 'zara@example.com',
    date: '2026-05-08',
    status: 'delivered',
    items: [
      { productId: 'p4', name: 'Apex Cargo Pants', qty: 1, price: 189 },
      { productId: 'p10', name: 'Zero-G Cap', qty: 1, price: 79 },
    ],
    total: 268,
    shippingAddress: '12 Neon Ave, Neo Tokyo, JP 100-001',
    trackingId: 'TRK-88410',
  },
];

/* ─── Customers ─────────────────────────────────────────────── */
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Zara Noctis',
    email: 'zara@example.com',
    joinDate: '2025-11-14',
    totalOrders: 12,
    totalSpent: 4820,
    lastActive: '2026-05-12',
    status: 'vip',
    avatar: 'ZN',
  },
  {
    id: 'c2',
    name: 'Kai Vantara',
    email: 'kai@example.com',
    joinDate: '2026-01-03',
    totalOrders: 5,
    totalSpent: 2340,
    lastActive: '2026-05-11',
    status: 'active',
    avatar: 'KV',
  },
  {
    id: 'c3',
    name: 'Nova Chen',
    email: 'nova@example.com',
    joinDate: '2025-08-22',
    totalOrders: 8,
    totalSpent: 6710,
    lastActive: '2026-05-11',
    status: 'vip',
    avatar: 'NC',
  },
  {
    id: 'c4',
    name: 'Rex Mortal',
    email: 'rex@example.com',
    joinDate: '2026-03-17',
    totalOrders: 2,
    totalSpent: 458,
    lastActive: '2026-05-12',
    status: 'active',
    avatar: 'RM',
  },
  {
    id: 'c5',
    name: 'Lyra Shade',
    email: 'lyra@example.com',
    joinDate: '2025-12-01',
    totalOrders: 7,
    totalSpent: 1890,
    lastActive: '2026-04-20',
    status: 'inactive',
    avatar: 'LS',
  },
  {
    id: 'c6',
    name: 'Dex Phantom',
    email: 'dex@example.com',
    joinDate: '2026-02-14',
    totalOrders: 3,
    totalSpent: 870,
    lastActive: '2026-05-08',
    status: 'active',
    avatar: 'DP',
  },
  {
    id: 'c7',
    name: 'Aria Voss',
    email: 'aria@example.com',
    joinDate: '2025-07-09',
    totalOrders: 19,
    totalSpent: 11240,
    lastActive: '2026-05-10',
    status: 'vip',
    avatar: 'AV',
  },
  {
    id: 'c8',
    name: 'Cruz Nox',
    email: 'cruz@example.com',
    joinDate: '2026-04-01',
    totalOrders: 1,
    totalSpent: 89,
    lastActive: '2026-05-01',
    status: 'active',
    avatar: 'CN',
  },
];

/* ─── Analytics ─────────────────────────────────────────────── */
export const MOCK_ANALYTICS: AnalyticsData = {
  kpis: {
    totalRevenue: 184920,
    totalOrders: 1247,
    totalVisitors: 48302,
    conversionRate: 2.58,
    revenueGrowth: 23.4,
    ordersGrowth: 18.7,
    visitorsGrowth: 31.2,
    conversionGrowth: 5.1,
  },
  revenue: [
    { date: 'Jan', value: 12400 },
    { date: 'Feb', value: 15800 },
    { date: 'Mar', value: 13200 },
    { date: 'Apr', value: 18900 },
    { date: 'May', value: 22400 },
    { date: 'Jun', value: 19800 },
    { date: 'Jul', value: 24600 },
    { date: 'Aug', value: 28100 },
    { date: 'Sep', value: 21300 },
    { date: 'Oct', value: 31400 },
    { date: 'Nov', value: 38200 },
    { date: 'Dec', value: 44820 },
  ],
  orders: [
    { date: 'Jan', value: 84 },
    { date: 'Feb', value: 109 },
    { date: 'Mar', value: 91 },
    { date: 'Apr', value: 128 },
    { date: 'May', value: 152 },
    { date: 'Jun', value: 134 },
    { date: 'Jul', value: 167 },
    { date: 'Aug', value: 189 },
    { date: 'Sep', value: 144 },
    { date: 'Oct', value: 211 },
    { date: 'Nov', value: 258 },
    { date: 'Dec', value: 301 },
  ],
  traffic: [
    { date: 'Jan', value: 3200 },
    { date: 'Feb', value: 3890 },
    { date: 'Mar', value: 3450 },
    { date: 'Apr', value: 4120 },
    { date: 'May', value: 4890 },
    { date: 'Jun', value: 4230 },
    { date: 'Jul', value: 5100 },
    { date: 'Aug', value: 5890 },
    { date: 'Sep', value: 4560 },
    { date: 'Oct', value: 6230 },
    { date: 'Nov', value: 7840 },
    { date: 'Dec', value: 9102 },
  ],
  topProducts: [
    { name: 'Void Runner X1', sales: 247, revenue: 73753 },
    { name: 'Neural Watch Pro', sales: 89, revenue: 115611 },
    { name: 'Phantom Jacket V2', sales: 134, revenue: 78926 },
    { name: 'Cipher Hoodie', sales: 312, revenue: 71448 },
    { name: 'Eclipse Backpack', sales: 178, revenue: 62122 },
  ],
  trafficSources: [
    { name: 'Direct', value: 38 },
    { name: 'Social', value: 27 },
    { name: 'Search', value: 21 },
    { name: 'Email', value: 9 },
    { name: 'Referral', value: 5 },
  ],
};

/* ─── Cart Item ─────────────────────────────────────────────── */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
}
