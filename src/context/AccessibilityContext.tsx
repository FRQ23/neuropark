import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../services/storage';

type TextSize = 'normal' | 'large' | 'xl';

interface AccessibilitySettings {
  highContrast: boolean;
  textSize: TextSize;
}

interface AccessibilityContextType {
  highContrast: boolean;
  textSize: TextSize;
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

    // Apply high-contrast class to html
    const root = document.documentElement;
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply text size class to html
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl');
    root.classList.add(`text-size-${settings.textSize}`);
  }, [settings]);

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const updateTextSize = (textSize: TextSize) => {
    setSettings((prev) => ({ ...prev, textSize }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast: settings.highContrast,
        textSize: settings.textSize,
        toggleHighContrast,
        setTextSize: updateTextSize,
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
