import React, { forwardRef } from 'react';

export const Input = forwardRef(({
    label,
    error,
    className = '',
    containerClassName = '',
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`input-field ${Icon ? 'pl-11' : ''} ${error ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20' : ''} w-full bg-dark-900 ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-red-400 mt-1">{error}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
