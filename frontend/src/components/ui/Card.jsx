import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, glow = false }) => {
    const baseClasses = "bg-dark-800 border border-white/10 rounded-2xl p-6";
    const hoverClasses = hover ? "transition-all duration-300 hover:bg-dark-800/80 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl" : "";
    const glowClasses = glow ? "hover:shadow-primary-500/10 box-glow" : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
        >
            {children}
        </motion.div>
    );
};

export const GlassCard = ({ children, className = '', hover = true }) => {
    const baseClasses = "glass p-6";
    const hoverClasses = hover ? "transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10" : "";

    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};
