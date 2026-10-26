import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
  colorScheme?: 'calm' | 'emerald' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  subLabel,
  size = 'md',
  showPercentage = true,
  className = '',
  colorScheme = 'calm',
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const barColor = {
    calm: 'w3-black',
    emerald: 'w3-green',
    amber: 'w3-dark-grey',
  }[colorScheme];

  const height = {
    sm: '6px',
    md: '12px',
    lg: '18px',
  }[size];

  return (
    <div className={`w3-margin-bottom ${className}`} style={{ marginBottom: '10px' }}>
      {(label || showPercentage) && (
        <div className="w3-row w3-small" style={{ marginBottom: '4px' }}>
          <div className="w3-col s8">
            <strong>{label}</strong>
            {subLabel && <span className="w3-text-grey" style={{ marginLeft: '8px' }}>{subLabel}</span>}
          </div>
          <div className="w3-col s4 w3-right-align">
            {showPercentage && <strong>{clampedValue}%</strong>}
          </div>
        </div>
      )}
      <div
        className="w3-light-grey w3-border"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progreso'}
        style={{ height, width: '100%', backgroundColor: '#f1f5f9' }}
      >
        <div
          className={barColor}
          style={{
            width: `${clampedValue}%`,
            height: '100%',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};
