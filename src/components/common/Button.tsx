import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[38px] gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2', // meets 44px touch target requirement
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-calm-600 text-white hover:bg-calm-700 active:bg-calm-800 focus-visible:outline-calm-600 shadow-sm',
    secondary:
      'bg-slatecalm-100 text-slate-800 hover:bg-slatecalm-200 active:bg-slatecalm-300 focus-visible:outline-slate-500 border border-slate-200',
    outline:
      'bg-transparent text-calm-700 hover:bg-calm-50 border border-calm-300 active:bg-calm-100 focus-visible:outline-calm-600',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:outline-rose-600 shadow-sm',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-slate-400',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
