import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight, Zap, Shield, Truck, Star, ChevronDown
} from 'lucide-react';
import FloatingNav from '@/components/storefront/FloatingNav';
import Footer from '@/components/storefront/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Product, CartItem } from '@/types';
import api from '@/lib/api';
import { fadeUp, staggerContainer, slideLeft, slideRight } from '@/lib/motion-variants';

interface HomeProps {
  cart: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
}

  // Removed duplicate state declarations

const USP_ITEMS = [
  { icon: <Zap size={20} />, title: 'Next-Day Delivery', desc: 'Order before midnight, receive tomorrow.' },
  { icon: <Shield size={20} />, title: '2-Year Warranty', desc: 'Every product backed by our ironclad guarantee.' },
  { icon: <Truck size={20} />, title: 'Free Returns', desc: '30-day no-questions-asked returns.' },
  { icon: <Star size={20} />, title: '50K+ Reviews', desc: 'Trusted by the community. Proven in the field.' },
];

export default function Home({ cart, onCartUpdate, addToCart }: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.8], ['blur(0px)', 'blur(10px)']);

  const [featured, setFeatured] = useState<Product[]>([]);
  const [gridProducts, setGridProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, gridRes] = await Promise.all([
          api.get('/products?featured=true'),
          api.get('/products?limit=8')
        ]);
        setFeatured(featuredRes.data?.products || featuredRes.data || []);
        setGridProducts(gridRes.data?.products || gridRes.data || []);
      } catch (err) {
        console.error('Failed to fetch home products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const HERO_FLOATING_PRODUCTS = featured.slice(0, 3);

  return (
    <>
      <Head>
        <title>Aitherios – Antigravity Streetwear & Tech Gear</title>
        <meta
          name="description"
          content="Aitherios is the premium destination for cyber-minimalist streetwear, cutting-edge accessories, and performance footwear. Shop the drop."
        />
      </Head>

      <FloatingNav cart={cart} onCartUpdate={onCartUpdate} />

      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center overflow-hidden"
          aria-label="Hero section"
        >
          {/* Background grid with parallax */}
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '10%']) }}
            className="absolute inset-0 grid-bg pointer-events-none" 
          />
          
          {/* Background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-crimson-500/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-crimson-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 pt-24 lg:pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Text */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs font-display font-bold tracking-widest uppercase text-crimson-400 border border-crimson-500/20">
                  <span className="w-1.5 h-1.5 bg-crimson-500 rounded-full animate-pulse" />
                  New Season Drop Live
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6"
              >
                <span className="text-white">Defy</span>
                <br />
                <span className="text-gradient-red">Gravity.</span>
                <br />
                <span className="text-white">Redefine</span>
                <br />
                <span className="text-gradient">Style.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-steel-200 text-lg leading-relaxed mb-8 max-w-md"
              >
                Engineered for the ones who move differently. Precision-crafted gear
                where technology meets aesthetic domination.
              </motion.p>

              <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-crimson-500 text-white font-display font-bold tracking-wider uppercase rounded-xl hover:bg-crimson-600 hover:shadow-glow transition-all duration-200 text-sm"
                  aria-label="Shop all products"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/products?tag=limited"
                  className="inline-flex items-center gap-2 px-7 py-3.5 glass border border-white/15 text-white font-display font-bold tracking-wider uppercase rounded-xl hover:border-crimson-500/50 transition-all duration-200 text-sm"
                >
                  Limited Drops
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-8 mt-12 pt-8 border-t border-white/8"
              >
                {[
                  { value: '50K+', label: 'Customers' },
                  { value: '4.9★', label: 'Rating' },
                  { value: '12+', label: 'Collections' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-display font-bold text-2xl text-white">{value}</p>
                    <p className="text-xs text-steel-300 tracking-widest uppercase">{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Floating Product Cards */}
            <motion.div 
              style={{ y: heroY, opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
              className="relative h-[400px] sm:h-[450px] lg:h-[500px]"
            >
              {HERO_FLOATING_PRODUCTS.map((product, i) => {
                const positions = [
                  { top: '5%', left: '15%', rotate: -6, delay: 0 },
                  { top: '35%', right: '5%', rotate: 4, delay: 0.15 },
                  { bottom: '5%', left: '5%', rotate: -3, delay: 0.3, hideOnMobile: true },
                ];
                const pos = positions[i];
                if (!product) return null;
                return (
                  <motion.div
                    key={product.id || i}
                    className={`absolute w-40 lg:w-52 glass rounded-2xl overflow-hidden shadow-card cursor-pointer hover:shadow-glow transition-shadow duration-300 ${pos.hideOnMobile ? 'hidden sm:block' : ''}`}
                    style={{ 
                      top: pos.top, 
                      left: pos.left, 
                      right: pos.right, 
                      bottom: pos.bottom,
                      rotate: pos.rotate 
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: [0, -12, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.6, delay: pos.delay },
                      y: {
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: pos.delay,
                      },
                    }}
                    whileHover={{ scale: 1.06, rotate: 0, zIndex: 10 }}
                  >
                    <div className="relative h-36">
                      <Image
                        src={product.images?.[0] || 'https://via.placeholder.com/208'}
                        alt={product.name || 'Loading'}
                        fill
                        className="object-cover"
                        sizes="208px"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-display font-bold text-xs text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-crimson-400 font-bold text-sm mt-0.5">
                        ${product.price}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              {/* Decorative glow blob */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 bg-crimson-500/15 rounded-full blur-[60px]" />
              </div>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-steel-400"
          >
            <span className="text-xs tracking-widest uppercase font-display">Scroll</span>
            <ChevronDown size={16} />
          </motion.div>
        </section>

        {/* ── Featured Products ─────────────────────────────── */}
        <section className="py-24 max-w-7xl mx-auto px-6" aria-label="Featured products">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-display font-bold tracking-widest uppercase text-crimson-500 mb-3"
            >
              Season Highlights
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-4xl md:text-5xl text-white"
            >
              Featured Drops
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : featured.length > 0 ? (
              featured.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-steel-400">
                No featured products found.
              </div>
            )}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-display font-bold tracking-wider uppercase text-steel-300 hover:text-crimson-400 transition-colors group"
              aria-label="View all products"
            >
              View All Products
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </section>

        {/* ── USP Strip ─────────────────────────────────────── */}
        <section
          className="py-16 border-y border-white/8 bg-obsidian-50"
          aria-label="Why choose Aitherios"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {USP_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-crimson-500/10 border border-crimson-500/20 flex items-center justify-center text-crimson-400">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-steel-300 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Product Grid ──────────────────────────────────── */}
        <section className="py-24 max-w-7xl mx-auto px-6" aria-label="Product catalogue">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <motion.p
                variants={slideLeft}
                className="text-xs font-display font-bold tracking-widest uppercase text-crimson-500 mb-3"
              >
                All Categories
              </motion.p>
              <motion.h2
                variants={slideLeft}
                className="font-display font-bold text-4xl md:text-5xl text-white"
              >
                The Arsenal
              </motion.h2>
            </div>
            <motion.div variants={slideRight}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 glass border border-white/15 rounded-xl text-sm font-display font-bold tracking-wider uppercase text-white hover:border-crimson-500/50 transition-all"
              >
                Browse All <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : gridProducts.length > 0 ? (
              gridProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-steel-400">
                No products found.
              </div>
            )}
          </motion.div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────── */}
        <section
          className="py-24 relative overflow-hidden"
          aria-label="Call to action"
        >
          <div className="absolute inset-0 bg-crimson-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-crimson-500/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-crimson-500/50 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-crimson-500/10 rounded-full blur-[80px] pointer-events-none" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto px-6 text-center relative"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-4xl md:text-6xl text-white mb-6 leading-tight"
            >
              Ready to{' '}
              <span className="text-gradient-red">elevate</span>
              {' '}your game?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-steel-200 text-lg mb-10"
            >
              New drops every Friday. Limited quantities. Zero compromises.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-crimson-500 text-white font-display font-bold tracking-wider uppercase rounded-xl hover:bg-crimson-600 hover:shadow-glow transition-all duration-200"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
