import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, helperText, className = '', required, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w3-margin-bottom" style={{ width: '100%' }}>
        <label htmlFor={inputId} className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
          <b>{label}</b>
          {required && <span className="w3-text-red" style={{ marginLeft: '4px' }}>*</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`w3-input w3-border ${className}`}
          style={{
            borderColor: error ? '#f44336' : undefined,
          }}
          {...props}
        />
        {error && <p className="w3-small w3-text-red w3-margin-top-small" style={{ margin: '4px 0 0 0' }}>{error}</p>}
        {helperText && !error && (
          <p className="w3-small w3-text-grey" style={{ margin: '4px 0 0 0' }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
