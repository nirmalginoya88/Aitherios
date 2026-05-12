import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product, CartItem } from '@/lib/mock-data';
import Badge from '../ui/Badge';
import { floatCard } from '@/lib/motion-variants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  loading?: boolean;
}

export default function ProductCard({ product, onAddToCart, loading = false }: ProductCardProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty: 1,
      size: product.variants.sizes?.[0],
      color: product.variants.colors?.[0]?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden bg-obsidian-200 animate-pulse">
        <div className="w-full h-72 skeleton" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-16 skeleton rounded-full" />
          <div className="h-5 w-3/4 skeleton rounded-md" />
          <div className="h-4 w-24 skeleton rounded-md" />
          <div className="flex justify-between mt-4">
            <div className="h-6 w-20 skeleton rounded-md" />
            <div className="h-9 w-28 skeleton rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.article
      variants={floatCard}
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group rounded-2xl overflow-hidden bg-obsidian-200 border border-white/5 hover:border-crimson-500/30 transition-colors duration-300 relative"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="relative w-full h-72">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Dark overlay on hover */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* Quick view button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <button
              onClick={(e) => { e.preventDefault(); router.push(`/products/${product.slug}`); }}
              className="flex items-center gap-2 px-4 py-2 glass rounded-full text-white text-xs font-display font-semibold tracking-wider uppercase hover:bg-white/10 transition-colors"
            >
              <Eye size={14} /> Quick View
            </button>
          </motion.div>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge variant="crimson" className="text-[10px]">
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Stock warning */}
        {product.stock <= 10 && (
          <div className="absolute top-3 right-10">
            <Badge variant="warning" className="text-[10px]">
              {product.stock} left
            </Badge>
          </div>
        )}
      </Link>

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setWishlisted(!wishlisted);
        }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={15}
          className={wishlisted ? 'text-crimson-500 fill-crimson-500' : 'text-steel-200'}
        />
      </button>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-steel-300 font-display tracking-widest uppercase mb-1">
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display font-bold text-white hover:text-crimson-400 transition-colors text-base leading-tight mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={star <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-steel-500'}
              />
            ))}
          </div>
          <span className="text-xs text-steel-300">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-white text-lg">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-steel-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,0,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-display font-bold tracking-wider uppercase
              transition-all duration-200
              ${added
                ? 'bg-emerald-500 text-white'
                : 'bg-crimson-500 text-white hover:bg-crimson-600 shadow-glow-sm hover:shadow-glow'
              }
            `}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={13} />
            {added ? 'Added!' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
