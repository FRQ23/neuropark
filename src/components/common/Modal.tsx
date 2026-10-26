import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyle = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '950px',
    '2xl': '1100px',
    '4xl': '1250px',
  }[maxWidth];

  return (
    <div
      className="w3-modal"
      style={{ display: 'block', zIndex: 1000 }}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w3-modal-content w3-card-4 w3-animate-top"
        style={{ maxWidth: widthStyle, width: '90%', margin: '48px auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="w3-container w3-light-grey w3-padding-16" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={onClose}
            className="w3-button w3-display-topright w3-large w3-hover-red"
            aria-label="Cerrar modal"
            style={{ fontWeight: 'bold' }}
          >
            &times;
          </button>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {description && (
            <p className="w3-small w3-text-grey" style={{ margin: '4px 0 0 0' }}>
              {description}
            </p>
          )}
        </header>

        <div className="w3-container w3-padding-16" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
