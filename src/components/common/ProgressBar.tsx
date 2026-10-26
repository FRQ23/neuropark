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

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }[size];

  const barColors = {
    calm: 'bg-calm-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
  }[colorScheme];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
          <span>{label}</span>
          <div className="flex items-center gap-2">
            {subLabel && <span className="text-slate-400 font-normal">{subLabel}</span>}
            {showPercentage && <span className="font-semibold text-slate-800">{clampedValue}%</span>}
          </div>
        </div>
      )}
      <div
        className={`w-full bg-slate-200/80 rounded-full overflow-hidden ${heightClasses}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progreso'}
      >
        <div
          className={`${barColors} ${heightClasses} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
