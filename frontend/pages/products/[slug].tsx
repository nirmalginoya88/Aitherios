import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingBag, Heart, ChevronLeft, ChevronRight,
  Shield, Truck, RefreshCw, Plus, Minus, ArrowLeft,
} from 'lucide-react';
import FloatingNav from '@/components/storefront/FloatingNav';
import Footer from '@/components/storefront/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { Product, CartItem } from '@/lib/mock-data';
import api from '@/lib/api';
import { fadeUp, staggerContainer, slideLeft } from '@/lib/motion-variants';

interface ProductDetailProps {
  cart: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
}

export default function ProductDetail({
  cart,
  onCartUpdate,
  addToCart,
}: ProductDetailProps) {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [imgIndex, setImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [prodRes, relRes] = await Promise.all([
          api.get(`/products/${slug}`),
          api.get(`/products?category=related&slug=${slug}&limit=4`) // Example related endpoint
        ]);
        setProduct(prodRes.data);
        setRelated(relRes.data || []);
        if (prodRes.data.variants?.sizes?.length) setSelectedSize(prodRes.data.variants.sizes[0]);
        if (prodRes.data.variants?.colors?.length) setSelectedColor(prodRes.data.variants.colors[0].name);
      } catch (err) {
        console.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty,
      size: selectedSize,
      color: selectedColor,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (loading) {
    return (
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-1/4 rounded-lg" />
              <Skeleton className="h-12 w-1/3 rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-16 min-h-screen text-center">
        <h1 className="text-2xl text-white font-display">Product not found.</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} – Aitherios</title>
        <meta name="description" content={product.description} />
      </Head>

      <FloatingNav cart={cart} onCartUpdate={onCartUpdate} />

      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-xs text-steel-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* Image Gallery */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden bg-obsidian-200 aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[imgIndex]}
                      alt={`${product.name} view ${imgIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Prev/Next */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setImgIndex((i) => (i - 1 + product.images.length) % product.images.length)
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setImgIndex((i) => (i + 1) % product.images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Discount badge */}
                {discount && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="crimson">-{discount}% OFF</Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        i === imgIndex ? 'border-crimson-500 shadow-glow-sm' : 'border-transparent'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Category + badges */}
              <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-steel-300 font-display tracking-widest uppercase">
                  {product.category}
                </span>
                {product.badge && <Badge variant="crimson">{product.badge}</Badge>}
                {product.stock <= 10 && (
                  <Badge variant="warning" pulse>Only {product.stock} left</Badge>
                )}
              </motion.div>

              {/* Name */}
              <motion.h1
                variants={fadeUp}
                className="font-display font-bold text-3xl md:text-4xl text-white leading-tight"
              >
                {product.name}
              </motion.h1>

              {/* Rating */}
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="flex" aria-label={`Rating: ${product.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-steel-500'}
                    />
                  ))}
                </div>
                <span className="text-sm text-steel-300">
                  {product.rating} · {product.reviews} reviews
                </span>
              </motion.div>

              {/* Price */}
              <motion.div variants={fadeUp} className="flex items-baseline gap-3">
                <span className="font-display font-bold text-4xl text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-steel-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {discount && (
                  <span className="text-sm text-emerald-400 font-semibold">
                    Save ${product.originalPrice! - product.price}
                  </span>
                )}
              </motion.div>

              {/* Description */}
              <motion.p variants={fadeUp} className="text-steel-200 leading-relaxed text-sm">
                {product.description}
              </motion.p>

              {/* Color selector */}
              {product.variants.colors && (
                <motion.div variants={fadeUp}>
                  <p className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 mb-3">
                    Color: <span className="text-white">{selectedColor}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {product.variants.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === color.name
                            ? 'border-crimson-500 scale-110 shadow-glow-sm'
                            : 'border-transparent hover:border-steel-400'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={`Select color: ${color.name}`}
                        aria-pressed={selectedColor === color.name}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Size selector */}
              {product.variants.sizes && (
                <motion.div variants={fadeUp}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-display font-bold tracking-widest uppercase text-steel-200">
                      Size: <span className="text-white">{selectedSize}</span>
                    </p>
                    <button className="text-xs text-steel-400 hover:text-crimson-400 transition-colors">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold border transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-crimson-500 bg-crimson-500/10 text-crimson-400 shadow-glow-sm'
                            : 'border-white/15 text-steel-300 hover:border-white/30 hover:text-white'
                        }`}
                        aria-pressed={selectedSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Qty + Add to cart */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 border border-white/10">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-steel-300 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-display font-bold text-white">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="text-steel-300 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,0,0,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold tracking-wider uppercase text-sm transition-all duration-200 ${
                    added
                      ? 'bg-emerald-500 text-white'
                      : 'bg-crimson-500 text-white hover:bg-crimson-600 shadow-glow'
                  }`}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag size={16} />
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </motion.button>

                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="w-12 h-12 glass rounded-xl border border-white/10 flex items-center justify-center hover:border-crimson-500/50 transition-all"
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wishlisted}
                >
                  <Heart
                    size={18}
                    className={wishlisted ? 'text-crimson-500 fill-crimson-500' : 'text-steel-300'}
                  />
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-3 gap-3 pt-4 border-t border-white/8"
              >
                {[
                  { icon: <Shield size={16} />, label: '2-Year Warranty' },
                  { icon: <Truck size={16} />, label: 'Free Shipping $500+' },
                  { icon: <RefreshCw size={16} />, label: '30-Day Returns' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                    <span className="text-crimson-400">{icon}</span>
                    <span className="text-[11px] text-steel-300 leading-tight">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Tabs */}
              <motion.div variants={fadeUp}>
                <div className="flex border-b border-white/8 mb-4">
                  {(['details', 'shipping', 'reviews'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs font-display font-bold tracking-widest uppercase capitalize border-b-2 transition-all -mb-px ${
                        activeTab === tab
                          ? 'border-crimson-500 text-crimson-400'
                          : 'border-transparent text-steel-300 hover:text-white'
                      }`}
                      aria-selected={activeTab === tab}
                      role="tab"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-steel-200 leading-relaxed"
                    role="tabpanel"
                  >
                    {activeTab === 'details' && (
                      <p>{product.description} Crafted with precision-grade materials. Each piece undergoes 48-hour stress testing before shipping.</p>
                    )}
                    {activeTab === 'shipping' && (
                      <ul className="space-y-2">
                        <li>• Standard delivery: 3–5 business days ($15)</li>
                        <li>• Express delivery: 1–2 business days ($25)</li>
                        <li>• Free shipping on orders over $500</li>
                        <li>• International shipping available to 80+ countries</li>
                      </ul>
                    )}
                    {activeTab === 'reviews' && (
                      <div className="space-y-3">
                        {[
                          { name: 'Z. Noctis', rating: 5, text: 'Absolutely premium. Every detail screams quality.' },
                          { name: 'K. Vantara', rating: 5, text: 'The fit is perfect. Worth every cent.' },
                          { name: 'N. Chen', rating: 4, text: 'Exceptional build quality. Fast shipping too.' },
                        ].map((review) => (
                          <div key={review.name} className="glass p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-xs text-white">{review.name}</span>
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-steel-300">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile sticky CTA */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 glass border-t border-white/8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-white">${product.price}</p>
                <p className="text-xs text-steel-300">{product.name}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                className="flex-1 max-w-xs flex items-center justify-center gap-2 py-3 bg-crimson-500 text-white rounded-xl font-display font-bold text-sm tracking-wider uppercase shadow-glow"
              >
                <ShoppingBag size={15} />
                {added ? 'Added!' : 'Add to Cart'}
              </motion.button>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-20" aria-label="Related products">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
                  You May Also Like
                </h2>
                <Link href="/products" className="text-sm text-steel-300 hover:text-crimson-400 transition-colors font-display tracking-wide flex items-center gap-1">
                  <ArrowLeft size={14} /> Back to Shop
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}


