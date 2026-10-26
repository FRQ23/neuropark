import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando datos...',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-8 h-8 text-calm-600 animate-spin mb-3" aria-hidden="true" />
      <span className="text-sm font-medium text-slate-600">{message}</span>
      <span className="sr-only">Cargando</span>
    </div>
  );
};
