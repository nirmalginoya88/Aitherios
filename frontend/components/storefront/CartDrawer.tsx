import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { drawerSlide, overlayFade, fadeUp } from '@/lib/motion-variants';
import { CartItem } from '@/lib/mock-data';
import Button from '../ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onCartUpdate,
}: CartDrawerProps) {
  const router = useRouter();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 500 ? 0 : 15;
  const total = subtotal + shipping;

  const updateQty = (productId: string, delta: number) => {
    onCartUpdate(
      cart
        .map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + delta } : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (productId: string) => {
    onCartUpdate(cart.filter((item) => item.productId !== productId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayFade}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            variants={drawerSlide}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{
              background: 'rgba(0,0,0,0.95)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
            }}
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-crimson-500" />
                <h2 className="font-display font-bold text-lg tracking-wide">
                  Cart{' '}
                  <span className="text-steel-300 font-normal text-sm">
                    ({cart.length} items)
                  </span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-steel-300 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal < 500 && (
              <div className="px-6 py-3 border-b border-white/5 bg-crimson-500/5">
                <p className="text-xs text-steel-200">
                  Add{' '}
                  <span className="text-crimson-400 font-semibold">
                    ${(500 - subtotal).toFixed(0)}
                  </span>{' '}
                  more for free shipping
                </p>
                <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-crimson-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <ShoppingBag size={48} className="text-steel-400 mb-4" />
                    <p className="font-display font-semibold text-lg text-white">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-steel-300 mt-1">
                      Start adding some fire products
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-6"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-3 rounded-xl glass"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-obsidian-300 flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm text-white truncate">
                          {item.name}
                        </p>
                        {item.size && (
                          <p className="text-xs text-steel-300 mt-0.5">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-xs text-steel-300">Color: {item.color}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQty(item.productId, -1)}
                              className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.productId, 1)}
                              className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-white">
                              ${(item.price * item.qty).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-steel-400 hover:text-crimson-500 transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-white/8 space-y-3">
                <div className="flex justify-between text-sm text-steel-300">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-steel-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-400 font-semibold' : 'text-white font-semibold'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-display font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-crimson-500 text-lg">${total.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onClose(); router.push('/cart'); }}
                  className="w-full flex items-center justify-center gap-2 mt-2 px-6 py-3.5 bg-crimson-500 text-white rounded-xl font-display font-bold tracking-wider uppercase text-sm hover:bg-crimson-600 hover:shadow-glow transition-all duration-200"
                >
                  Checkout <ArrowRight size={16} />
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full text-center text-xs text-steel-400 hover:text-white transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
