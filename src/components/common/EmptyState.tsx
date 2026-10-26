import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`w3-container w3-white w3-card w3-padding-32 w3-center w3-margin-bottom ${className}`}>
      <p>
        {icon || <i className="fa fa-folder-open-o w3-xxxlarge w3-text-grey" aria-hidden="true"></i>}
      </p>
      <h3>{title}</h3>
      <p className="w3-text-grey" style={{ maxWidth: '400px', margin: '0 auto 16px auto' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
