import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, glow = false }) => {
    const baseClasses = "bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm";
    const hoverClasses = hover ? "transition-all duration-300 hover:border-gray-200 hover:-translate-y-1 hover:shadow-card-hover" : "";
    const glowClasses = glow ? "hover:shadow-led relative overflow-hidden" : "";

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
    const hoverClasses = hover ? "transition-all duration-300 hover:bg-white/90 hover:border-white hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-500/10" : "";

    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};
