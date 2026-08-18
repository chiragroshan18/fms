import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  animate = true,
  delay = 0,
  ...props
}) => {
  const Component = animate ? motion.div : 'div';

  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay, ease: 'easeOut' },
      }
    : {};

  return (
    <Component
      className={`glass-panel rounded-2xl p-6 ${
        hoverEffect ? 'glass-panel-hover' : ''
      } ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};
