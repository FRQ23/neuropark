import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: ToastMessage = { id, type, title, message };

      setToasts((prev) => [...prev.slice(-3), newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const showSuccess = useCallback((title: string, msg?: string) => addToast('success', title, msg), [addToast]);
  const showError = useCallback((title: string, msg?: string) => addToast('error', title, msg), [addToast]);
  const showInfo = useCallback((title: string, msg?: string) => addToast('info', title, msg), [addToast]);
  const showWarning = useCallback((title: string, msg?: string) => addToast('warning', title, msg), [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}

      {/* Floating Notifications in W3.CSS Panel style */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          maxWidth: '380px',
          width: '90%',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          const panelClass = {
            success: 'w3-panel w3-green w3-card-4 w3-display-container',
            error: 'w3-panel w3-red w3-card-4 w3-display-container',
            warning: 'w3-panel w3-khaki w3-card-4 w3-display-container',
            info: 'w3-panel w3-blue w3-card-4 w3-display-container',
          }[toast.type];

          const iconClass = {
            success: 'fa fa-check-circle',
            error: 'fa fa-exclamation-circle',
            warning: 'fa fa-exclamation-triangle',
            info: 'fa fa-info-circle',
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={panelClass}
              style={{ padding: '12px 32px 12px 16px', margin: '8px 0' }}
              role="alert"
            >
              <span
                onClick={() => removeToast(toast.id)}
                className="w3-button w3-display-topright w3-hover-none"
                style={{ fontSize: '18px', padding: '4px 10px', cursor: 'pointer' }}
                aria-label="Cerrar notificación"
              >
                &times;
              </span>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                <i className={`${iconClass} w3-margin-right`}></i>
                {toast.title}
              </p>
              {toast.message && (
                <p className="w3-small" style={{ margin: '4px 0 0 0' }}>
                  {toast.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
