/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
};

export const containerStagger = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const itemFadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const hoverScale = {
  whileHover: { scale: 1.02, y: -4, transition: { duration: 0.2, ease: 'easeInOut' } },
  whileTap: { scale: 0.98 },
};

export const buttonPress = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.99 },
};
