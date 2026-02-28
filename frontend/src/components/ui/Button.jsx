import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    ...props
}) => {

    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        cyber: "btn-cyber",
        danger: "btn-danger",
        ghost: "px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg",
    };

    // If using btn-primary, btn-secondary etc, they already have padding, so we might want to strip it or adapt.
    // Actually, our index.css already defined padding for the btn classes.
    // Let's rely on CSS classes as much as possible.

    const baseClass = variants[variant] || variants.primary;
    // Override padding if size is explicitly changed, but for now CSS handles it.

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`${baseClass} flex items-center justify-center gap-2 ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </motion.button>
    );
};
