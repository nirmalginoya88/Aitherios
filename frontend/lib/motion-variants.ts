import { Variants } from 'framer-motion';

/* ─── Fade + Slide Up ─────────────────────────────────────────── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/* ─── Stagger Container ───────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

/* ─── Floating Card ───────────────────────────────────────────── */
export const floatCard: Variants = {
  rest: { y: 0, rotate: 0, scale: 1 },
  hover: {
    y: -10,
    rotate: 1,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

/* ─── Glow Button ─────────────────────────────────────────────── */
export const glowButton: Variants = {
  rest: { boxShadow: '0 0 0px rgba(255,0,0,0)' },
  hover: {
    boxShadow: '0 0 25px rgba(255,0,0,0.6)',
    scale: 1.03,
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.97 },
};

/* ─── Drawer Slide ────────────────────────────────────────────── */
export const drawerSlide: Variants = {
  closed: { x: '100%', opacity: 0 },
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

/* ─── Overlay Fade ────────────────────────────────────────────── */
export const overlayFade: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/* ─── Scale Pop ───────────────────────────────────────────────── */
export const scalePop: Variants = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

/* ─── Slide Left ──────────────────────────────────────────────── */
export const slideLeft: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── Slide Right ─────────────────────────────────────────────── */
export const slideRight: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── Page Transition ─────────────────────────────────────────── */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};
