import type { AppProps } from 'next/app';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/lib/auth';
import '@/styles/globals.css';
import { CartItem } from '@/types';
import { pageTransition } from '@/lib/motion-variants';

export default function App({ Component, pageProps, router }: AppProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleCartUpdate = (items: CartItem[]) => setCart(items);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i,
        );
      }
      return [...prev, item];
    });
  };

  // Inject cart props into every page
  const enhancedProps = { ...pageProps, cart, onCartUpdate: handleCartUpdate, addToCart };

  return (
    <AuthProvider>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={router.asPath}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Component {...enhancedProps} />
        </motion.div>
      </AnimatePresence>
    </AuthProvider>
  );
}
