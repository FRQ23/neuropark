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

  return (
    <div className={`w3-margin-bottom ${className}`}>
      {(label || showPercentage) && (
        <div className="w3-row w3-small w3-margin-bottom">
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
      >
        <div
          className={`w3-container ${barColor} w3-center w3-small`}
          style={{ width: `${clampedValue}%`, minWidth: clampedValue > 0 ? '24px' : '0', padding: '2px 0' }}
        >
          {clampedValue > 5 && `${clampedValue}%`}
        </div>
      </div>
    </div>
  );
};
