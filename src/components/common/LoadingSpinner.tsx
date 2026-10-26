import React from 'react';

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
      className={`w3-container w3-center w3-padding-64 ${className}`}
      role="status"
      aria-live="polite"
    >
      <p>
        <i className="fa fa-spinner fa-spin w3-xxlarge w3-text-dark-grey" aria-hidden="true"></i>
      </p>
      <p className="w3-large w3-text-grey">{message}</p>
      <span className="sr-only">Cargando</span>
    </div>
  );
};
