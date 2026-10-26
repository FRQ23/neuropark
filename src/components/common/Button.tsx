import React from 'react';

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
  const sizeClass = {
    sm: 'w3-small w3-padding-small',
    md: 'w3-padding',
    lg: 'w3-large w3-padding-large',
  }[size];

  const variantClass = {
    primary: 'w3-button w3-black w3-hover-dark-grey',
    secondary: 'w3-button w3-light-grey w3-hover-grey',
    outline: 'w3-button w3-border w3-hover-light-grey',
    danger: 'w3-button w3-red w3-hover-dark-grey',
    ghost: 'w3-button w3-hover-light-grey',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${variantClass} ${sizeClass} ${className}`}
      style={{ cursor: disabled || isLoading ? 'not-allowed' : 'pointer' }}
      {...props}
    >
      {isLoading ? (
        <i className="fa fa-spinner fa-spin w3-margin-right" aria-hidden="true"></i>
      ) : (
        leftIcon && <span style={{ marginRight: '6px' }}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span style={{ marginLeft: '6px' }}>{rightIcon}</span>}
    </button>
  );
};
