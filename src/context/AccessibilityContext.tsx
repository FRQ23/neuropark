import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../services/storage';

export type TextSize = 'normal' | 'large' | 'xl';
export type ThemeMode = 'warm-paper' | 'soft-dark' | 'high-contrast';

interface CognitiveAccessibilitySettings {
  themeMode: ThemeMode;
  textSize: TextSize;
  isDyslexicFont: boolean;
  isReadingRuler: boolean;
  isFocusMask: boolean;
  isExpandedSpacing: boolean;
  isCogaChunking: boolean;
  isReducedMotion: boolean;
}

interface AccessibilityContextType extends CognitiveAccessibilitySettings {
  toggleHighContrast: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setTextSize: (size: TextSize) => void;
  toggleDyslexicFont: () => void;
  toggleReadingRuler: () => void;
  toggleFocusMask: () => void;
  toggleExpandedSpacing: () => void;
  toggleCogaChunking: () => void;
  toggleReducedMotion: () => void;
  resetAccessibilitySettings: () => void;
}

const DEFAULT_SETTINGS: CognitiveAccessibilitySettings = {
  themeMode: 'warm-paper', // Papel cálido W3C COGA por defecto
  textSize: 'normal',
  isDyslexicFont: false,
  isReadingRuler: false,
  isFocusMask: false,
  isExpandedSpacing: false,
  isCogaChunking: false,
  isReducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CognitiveAccessibilitySettings>(() => {
    return getStoredItem<CognitiveAccessibilitySettings>(
      STORAGE_KEYS.ACCESSIBILITY,
      DEFAULT_SETTINGS
    );
  });

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.ACCESSIBILITY, settings);

    const root = document.documentElement;

    // 1. Theme Mode
    root.classList.remove('warm-paper', 'soft-dark', 'high-contrast');
    root.classList.add(settings.themeMode);

    // 2. Text Size
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl');
    root.classList.add(`text-size-${settings.textSize}`);

    // 3. OpenDyslexic Font
    if (settings.isDyslexicFont) {
      root.classList.add('font-dyslexic');
    } else {
      root.classList.remove('font-dyslexic');
    }

    // 4. Expanded Spacing
    if (settings.isExpandedSpacing) {
      root.classList.add('expanded-spacing');
    } else {
      root.classList.remove('expanded-spacing');
    }

    // 5. W3C COGA Chunking (65ch)
    if (settings.isCogaChunking) {
      root.classList.add('coga-chunking');
    } else {
      root.classList.remove('coga-chunking');
    }

    // 6. Reduced Motion
    if (settings.isReducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [settings]);

  const setThemeMode = (mode: ThemeMode) => {
    setSettings((prev) => ({ ...prev, themeMode: mode }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'high-contrast' ? 'warm-paper' : 'high-contrast',
    }));
  };

  const setTextSize = (textSize: TextSize) => {
    setSettings((prev) => ({ ...prev, textSize }));
  };

  const toggleDyslexicFont = () => {
    setSettings((prev) => ({ ...prev, isDyslexicFont: !prev.isDyslexicFont }));
  };

  const toggleReadingRuler = () => {
    setSettings((prev) => ({ ...prev, isReadingRuler: !prev.isReadingRuler }));
  };

  const toggleFocusMask = () => {
    setSettings((prev) => ({ ...prev, isFocusMask: !prev.isFocusMask }));
  };

  const toggleExpandedSpacing = () => {
    setSettings((prev) => ({ ...prev, isExpandedSpacing: !prev.isExpandedSpacing }));
  };

  const toggleCogaChunking = () => {
    setSettings((prev) => ({ ...prev, isCogaChunking: !prev.isCogaChunking }));
  };

  const toggleReducedMotion = () => {
    setSettings((prev) => ({ ...prev, isReducedMotion: !prev.isReducedMotion }));
  };

  const resetAccessibilitySettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setThemeMode,
        toggleHighContrast,
        setTextSize,
        toggleDyslexicFont,
        toggleReadingRuler,
        toggleFocusMask,
        toggleExpandedSpacing,
        toggleCogaChunking,
        toggleReducedMotion,
        resetAccessibilitySettings,
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
