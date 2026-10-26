import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../services/storage';

export type TextSize = 'normal' | 'large' | 'xl';

interface AccessibilitySettings {
  highContrast: boolean;
  textSize: TextSize;
}

interface AccessibilityContextType extends AccessibilitySettings {
  toggleHighContrast: () => void;
  setTextSize: (size: TextSize) => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  textSize: 'normal',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    return getStoredItem<AccessibilitySettings>(STORAGE_KEYS.ACCESSIBILITY, DEFAULT_SETTINGS);
  });

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.ACCESSIBILITY, settings);
    const root = document.documentElement;

    if (settings.highContrast) {
      root.classList.add('w3-grayscale-min');
    } else {
      root.classList.remove('w3-grayscale-min');
    }
  }, [settings]);

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setTextSize = (textSize: TextSize) => {
    setSettings((prev) => ({ ...prev, textSize }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        toggleHighContrast,
        setTextSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
