import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import FloatingNav from '@/components/storefront/FloatingNav';
import Footer from '@/components/storefront/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Product, CartItem } from '@/types';
import api from '@/lib/api';
import { staggerContainer, fadeUp, slideLeft } from '@/lib/motion-variants';

const CATEGORIES = ['All', 'Footwear', 'Outerwear', 'Tops', 'Bottoms', 'Bags', 'Accessories'];
const TAGS = ['new', 'limited', 'bestseller', 'sale', 'premium'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

interface ProductsPageProps {
  cart: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
}

export default function ProductsPage({ cart, onCartUpdate, addToCart }: ProductsPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState(
    (router.query.category as string) || 'All',
  );
  const [activeTag, setActiveTag] = useState(
    (router.query.tag as string) || '',
  );
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data?.products || res.data || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== 'All') result = result.filter((p) => p.category === category);
    if (activeTag) result = result.filter((p) => p.tags.includes(activeTag));
    result = result.filter((p) => p.price <= maxPrice);
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, category, activeTag, maxPrice, sort]);

  const clearFilters = () => {
    setCategory('All');
    setActiveTag('');
    setMaxPrice(2000);
    setSort('featured');
  };

  const hasFilters = category !== 'All' || activeTag !== '' || maxPrice < 2000;

  return (
    <>
      <Head>
        <title>Shop All Products – Aitherios</title>
        <meta
          name="description"
          content="Browse Aitherios's full catalogue of premium streetwear, footwear, and accessories. Filter by category, tag, and price."
        />
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
            <motion.p
              variants={fadeUp}
              className="text-xs font-display font-bold tracking-widest uppercase text-crimson-500 mb-3"
            >
              Full Catalogue
            </motion.p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <motion.h1
                variants={fadeUp}
                className="font-display font-bold text-4xl md:text-5xl text-white"
              >
                The Arsenal
              </motion.h1>
              <motion.p variants={fadeUp} className="text-steel-300 text-sm">
                {filtered.length} products
              </motion.p>
            </div>
          </motion.div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-display font-bold tracking-wider uppercase transition-all duration-200
                    ${category === cat
                      ? 'bg-crimson-500 text-white shadow-glow-sm'
                      : 'glass text-steel-300 hover:text-white hover:border-white/20'
                    }
                  `}
                  aria-pressed={category === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-steel-300 hover:text-crimson-400 transition-colors font-display tracking-wider uppercase"
                >
                  <X size={12} /> Clear
                </button>
              )}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="glass border border-white/10 text-white text-xs font-display tracking-wider uppercase rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-crimson-500 cursor-pointer bg-transparent appearance-none"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-obsidian-200 text-white">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-steel-300 pointer-events-none" />
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 glass border border-white/10 px-3 py-2 rounded-lg text-xs font-display font-bold tracking-wider uppercase text-steel-200 hover:text-white hover:border-white/20 transition-all"
                aria-expanded={sidebarOpen}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>

          {/* Filter sidebar + Grid */}
          <div className="flex gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={false}
              animate={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden flex-shrink-0"
              aria-label="Product filters"
            >
              <div className="w-60 space-y-6 pr-4">
                {/* Tags */}
                <div>
                  <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setActiveTag('')}
                      className={`flex items-center gap-2 text-sm transition-colors ${activeTag === '' ? 'text-crimson-400 font-semibold' : 'text-steel-300 hover:text-white'}`}
                    >
                      <span className={`w-3 h-3 rounded-full border ${activeTag === '' ? 'border-crimson-500 bg-crimson-500' : 'border-steel-400'}`} />
                      All Tags
                    </button>
                    {TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`flex items-center gap-2 text-sm capitalize transition-colors ${activeTag === tag ? 'text-crimson-400 font-semibold' : 'text-steel-300 hover:text-white'}`}
                      >
                        <span className={`w-3 h-3 rounded-full border ${activeTag === tag ? 'border-crimson-500 bg-crimson-500' : 'border-steel-400'}`} />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 mb-3">
                    Max Price: <span className="text-white">${maxPrice}</span>
                  </h3>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-crimson-500 cursor-pointer"
                    aria-label="Maximum price filter"
                  />
                  <div className="flex justify-between text-xs text-steel-400 mt-1">
                    <span>$50</span>
                    <span>$2000</span>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Product grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-display font-bold text-xl text-white mb-2">
                    No products found
                  </p>
                  <p className="text-steel-300 text-sm mb-6">
                    Try adjusting your filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-crimson-400 hover:text-crimson-300 font-display font-bold text-sm tracking-wider uppercase transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))
                    : filtered.map((product) => (
                        <motion.div key={product.id} variants={fadeUp}>
                          <ProductCard product={product} onAddToCart={addToCart} />
                        </motion.div>
                      ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
