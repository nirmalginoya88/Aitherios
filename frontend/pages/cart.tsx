import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Plus, Minus, Trash2, ArrowRight,
  Shield, Lock, CreditCard, CheckCircle,
} from 'lucide-react';
import FloatingNav from '@/components/storefront/FloatingNav';
import Footer from '@/components/storefront/Footer';
import { CartItem } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/FormElements';
import { fadeUp, staggerContainer, scalePop } from '@/lib/motion-variants';

interface CartPageProps {
  cart: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
}

type CheckoutStep = 'cart' | 'information' | 'payment' | 'confirmed';

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'cart', label: 'Cart' },
  { key: 'information', label: 'Info' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmed', label: 'Confirmed' },
];

export default function CartPage({ cart, onCartUpdate }: CartPageProps) {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQty = (productId: string, delta: number) => {
    onCartUpdate(
      cart.map((i) =>
        i.productId === productId ? { ...i, qty: i.qty + delta } : i,
      ).filter((i) => i.qty > 0),
    );
  };

  const removeItem = (productId: string) => {
    onCartUpdate(cart.filter((i) => i.productId !== productId));
  };

  const simulateCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('confirmed');
      onCartUpdate([]);
    }, 1800);
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <>
      <Head>
        <title>Cart & Checkout – Aitherios</title>
        <meta name="description" content="Review your Aitherios cart and complete your purchase securely." />
      </Head>

      <FloatingNav cart={cart} onCartUpdate={onCartUpdate} />

      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="py-8 border-b border-white/8 mb-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-6">
              {step === 'confirmed' ? 'Order Confirmed ✓' : 'Checkout'}
            </h1>

            {/* Step indicator */}
            <nav className="flex items-center gap-1" aria-label="Checkout steps">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-display font-bold tracking-wider uppercase transition-all ${
                    i === currentStepIndex
                      ? 'bg-crimson-500 text-white'
                      : i < currentStepIndex
                      ? 'text-emerald-400'
                      : 'text-steel-400'
                  }`}>
                    {i < currentStepIndex && <CheckCircle size={12} />}
                    {s.label}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-px mx-1 ${i < currentStepIndex ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </nav>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Cart Step ───────────────────────────────────── */}
            {step === 'cart' && (
              <motion.div
                key="cart"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.length === 0 ? (
                    <motion.div
                      variants={scalePop}
                      className="text-center py-24 glass rounded-2xl"
                    >
                      <ShoppingBag size={48} className="text-steel-400 mx-auto mb-4" />
                      <h2 className="font-display font-bold text-xl text-white mb-2">
                        Your cart is empty
                      </h2>
                      <p className="text-steel-300 text-sm mb-6">
                        Head back to the shop and grab something fire.
                      </p>
                      <motion.a
                        href="/products"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson-500 text-white font-display font-bold tracking-wider uppercase rounded-lg text-sm hover:bg-crimson-600 hover:shadow-glow transition-all"
                      >
                        Browse Products
                      </motion.a>
                    </motion.div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <motion.div
                          key={item.productId}
                          variants={fadeUp}
                          layout
                          className="glass rounded-2xl p-4 flex gap-4"
                        >
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-obsidian-300 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-white">{item.name}</p>
                            <div className="flex gap-3 mt-0.5 text-xs text-steel-300">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 border border-white/10">
                                <button onClick={() => updateQty(item.productId, -1)} aria-label="Decrease">
                                  <Minus size={12} className="text-steel-300 hover:text-white" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-white">{item.qty}</span>
                                <button onClick={() => updateQty(item.productId, 1)} aria-label="Increase">
                                  <Plus size={12} className="text-steel-300 hover:text-white" />
                                </button>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-display font-bold text-white">
                                  ${(item.price * item.qty).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => removeItem(item.productId)}
                                  className="text-steel-400 hover:text-crimson-500 transition-colors"
                                  aria-label={`Remove ${item.name}`}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>

                {/* Summary */}
                {cart.length > 0 && (
                  <motion.div variants={fadeUp} className="glass rounded-2xl p-6 h-fit space-y-4">
                    <h2 className="font-display font-bold text-lg text-white">Order Summary</h2>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                        { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, green: shipping === 0 },
                        { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
                      ].map(({ label, value, green }) => (
                        <div key={label} className="flex justify-between text-steel-300">
                          <span>{label}</span>
                          <span className={green ? 'text-emerald-400 font-semibold' : 'text-white font-semibold'}>
                            {value}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-display font-bold text-base pt-3 border-t border-white/10">
                        <span className="text-white">Total</span>
                        <span className="text-crimson-400 text-lg">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Promo code */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 glass border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-steel-400 focus:outline-none focus:border-crimson-500 transition-all"
                        aria-label="Promo code"
                      />
                      <button className="px-4 py-2 glass border border-white/15 rounded-lg text-xs font-display font-bold uppercase text-steel-200 hover:text-white hover:border-crimson-500/50 transition-all">
                        Apply
                      </button>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => setStep('information')}
                    >
                      Proceed to Checkout <ArrowRight size={16} />
                    </Button>

                    {/* Trust */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                      {[
                        { icon: <Lock size={13} />, label: 'Secure' },
                        { icon: <Shield size={13} />, label: 'Protected' },
                        { icon: <CreditCard size={13} />, label: 'Encrypted' },
                      ].map(({ icon, label }) => (
                        <div key={label} className="flex items-center gap-1 text-xs text-steel-400">
                          {icon} {label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── Information Step ───────────────────────────── */}
            {step === 'information' && (
              <motion.div
                key="information"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-6">
                  <motion.div variants={fadeUp} className="glass rounded-2xl p-6 space-y-4">
                    <h2 className="font-display font-bold text-lg text-white">
                      Shipping Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="Zara" />
                      <Input label="Last Name" placeholder="Noctis" />
                      <Input label="Email" type="email" placeholder="zara@example.com" className="sm:col-span-2" />
                      <Input label="Address" placeholder="12 Neon Ave" className="sm:col-span-2" />
                      <Input label="City" placeholder="Neo Tokyo" />
                      <Input label="Postal Code" placeholder="100-001" />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex gap-4">
                    <Button variant="ghost" onClick={() => setStep('cart')}>
                      ← Back
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={() => setStep('payment')}>
                      Continue to Payment <ArrowRight size={16} />
                    </Button>
                  </motion.div>
                </div>

                {/* Mini summary */}
                <motion.div variants={fadeUp} className="glass rounded-2xl p-6 h-fit space-y-3">
                  <h3 className="font-display font-bold text-sm text-steel-200 uppercase tracking-widest">
                    {cart.length} Items
                  </h3>
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-steel-300 truncate">{item.name} ×{item.qty}</span>
                      <span className="text-white font-semibold ml-2">${(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-display font-bold pt-2 border-t border-white/10">
                    <span className="text-white">Total</span>
                    <span className="text-crimson-400">${total.toFixed(2)}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── Payment Step ───────────────────────────────── */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-6">
                  <motion.div variants={fadeUp} className="glass rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display font-bold text-lg text-white">Payment Details</h2>
                      <div className="flex items-center gap-1 text-xs text-steel-300">
                        <Lock size={12} className="text-emerald-400" />
                        SSL Secured
                      </div>
                    </div>
                    <Input label="Card Number" placeholder="4242 4242 4242 4242" icon={<CreditCard size={15} />} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry" placeholder="MM / YY" />
                      <Input label="CVV" placeholder="•••" type="password" />
                    </div>
                    <Input label="Name on Card" placeholder="ZARA NOCTIS" />

                    {/* Pay methods */}
                    <div className="pt-2">
                      <p className="text-xs text-steel-400 mb-3">Or pay with</p>
                      <div className="flex gap-3">
                        {['Apple Pay', 'Google Pay', 'PayPal'].map((method) => (
                          <button
                            key={method}
                            className="flex-1 py-2.5 glass border border-white/10 rounded-lg text-xs font-display font-bold text-steel-200 hover:border-crimson-500/50 hover:text-white transition-all"
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex gap-4">
                    <Button variant="ghost" onClick={() => setStep('information')}>
                      ← Back
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      loading={loading}
                      onClick={simulateCheckout}
                    >
                      {loading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
                    </Button>
                  </motion.div>
                </div>

                <motion.div variants={fadeUp} className="glass rounded-2xl p-6 h-fit space-y-3">
                  <h3 className="font-display font-bold text-sm text-steel-200 uppercase tracking-widest">
                    Order Total
                  </h3>
                  {[
                    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` },
                    { label: 'Tax', value: `$${tax.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm text-steel-300">
                      <span>{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-display font-bold text-lg pt-3 border-t border-white/10">
                    <span className="text-white">Total</span>
                    <span className="text-crimson-400">${total.toFixed(2)}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── Confirmed Step ─────────────────────────────── */}
            {step === 'confirmed' && (
              <motion.div
                key="confirmed"
                variants={scalePop}
                initial="hidden"
                animate="visible"
                className="text-center py-24 max-w-lg mx-auto"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={36} className="text-emerald-400" />
                </motion.div>
                <h2 className="font-display font-bold text-3xl text-white mb-3">
                  Order Placed!
                </h2>
                <p className="text-steel-300 mb-2">
                  Your order <span className="text-white font-semibold">#ORD-{Math.floor(Math.random() * 90000) + 10000}</span> has been confirmed.
                </p>
                <p className="text-steel-400 text-sm mb-10">
                  Confirmation sent to your email. Expected delivery: 2–4 business days.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 glass border border-white/20 text-white font-display font-bold tracking-wider uppercase rounded-xl text-sm hover:border-crimson-500/50 transition-all"
                  >
                    Track Order
                  </a>
                  <a
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson-500 text-white font-display font-bold tracking-wider uppercase rounded-xl text-sm hover:bg-crimson-600 hover:shadow-glow transition-all"
                  >
                    Continue Shopping
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}
