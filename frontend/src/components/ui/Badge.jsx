import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: "badge-info",
        success: "badge-success",
        warning: "badge-warning",
        danger: "badge-danger",
        cyber: "badge-cyber",
        accent: "badge-accent",
        neutral: "bg-white/10 text-gray-300 border border-white/20",
    };

    const baseClass = variants[variant] || variants.primary;

    return (
        <span className={`badge ${baseClass} ${className}`}>
            {children}
        </span>
    );
};
