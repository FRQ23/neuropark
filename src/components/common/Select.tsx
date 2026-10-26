import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, error, helperText, className = '', required, ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w3-margin-bottom" style={{ width: '100%' }}>
        <label htmlFor={selectId} className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
          <b>{label}</b>
          {required && <span className="w3-text-red" style={{ marginLeft: '4px' }}>*</span>}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={`w3-select w3-border ${className}`}
          style={{
            borderColor: error ? '#f44336' : undefined,
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="w3-small w3-text-red" style={{ margin: '4px 0 0 0' }}>{error}</p>}
        {helperText && !error && <p className="w3-small w3-text-grey" style={{ margin: '4px 0 0 0' }}>{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
