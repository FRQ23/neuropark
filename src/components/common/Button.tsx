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
    'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none rounded text-xs';

  const sizeStyles = {
    sm: 'px-3 py-1.5 min-h-[38px] gap-1.5 text-xs',
    md: 'px-4 py-2.5 min-h-[44px] gap-2 text-xs',
    lg: 'px-6 py-3 min-h-[48px] gap-2.5 text-sm',
  }[size];

  const variantStyles = {
    primary:
      'w3-black text-white hover:bg-neutral-800 active:bg-neutral-900 border border-black shadow-xs',
    secondary:
      'w3-light-grey text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-300',
    outline:
      'bg-transparent text-slate-900 hover:bg-slate-100 border border-slate-400',
    danger:
      'w3-red text-white hover:bg-red-700 active:bg-red-800 shadow-xs',
    ghost:
      'bg-transparent text-slate-800 hover:bg-slate-100',
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
