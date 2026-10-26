import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Sun, Type, Brain, SlidersHorizontal } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const {
    themeMode,
    setThemeMode,
    textSize,
    setTextSize,
    isDyslexicFont,
    toggleDyslexicFont,
  } = useAccessibility();

  return (
    <div
      aria-label="Herramientas de accesibilidad cognitiva y bajo estímulo"
      className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200"
    >
      {/* Dyslexia OpenDyslexic quick toggle */}
      <button
        type="button"
        onClick={toggleDyslexicFont}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors min-h-[36px] ${
          isDyslexicFont
            ? 'bg-calm-700 text-white shadow-xs font-bold'
            : 'text-slate-700 hover:bg-white hover:shadow-xs'
        }`}
        aria-pressed={isDyslexicFont}
        title="Activar fuente OpenDyslexic (Optimización para dislexia)"
      >
        <Type className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden md:inline">OpenDyslexic</span>
      </button>

      <span className="w-px h-4 bg-slate-300" aria-hidden="true" />

      {/* Theme Mode Cycle */}
      <button
        type="button"
        onClick={() => {
          if (themeMode === 'warm-paper') setThemeMode('soft-dark');
          else if (themeMode === 'soft-dark') setThemeMode('high-contrast');
          else setThemeMode('warm-paper');
        }}
        className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors min-h-[36px] ${
          themeMode === 'high-contrast'
            ? 'bg-black text-yellow-300 font-bold border border-yellow-300'
            : themeMode === 'soft-dark'
            ? 'bg-slate-800 text-slate-100 font-semibold'
            : 'text-slate-700 hover:bg-white hover:shadow-xs'
        }`}
        title={`Tema actual: ${
          themeMode === 'warm-paper'
            ? 'Papel Cálido (W3C COGA)'
            : themeMode === 'soft-dark'
            ? 'Modo Oscuro Suave'
            : 'Alto Contraste'
        }. Clic para cambiar.`}
      >
        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">
          {themeMode === 'warm-paper'
            ? 'Papel Cálido'
            : themeMode === 'soft-dark'
            ? 'Oscuro Suave'
            : 'Contraste'}
        </span>
      </button>

      <span className="w-px h-4 bg-slate-300" aria-hidden="true" />

      {/* Text Size Scale */}
      <div className="flex items-center gap-0.5" role="group" aria-label="Tamaño de texto">
        <button
          type="button"
          onClick={() => setTextSize('normal')}
          className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
            textSize === 'normal'
              ? 'bg-white text-calm-800 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={textSize === 'normal'}
          title="Texto 16px"
        >
          A
        </button>
        <button
          type="button"
          onClick={() => setTextSize('large')}
          className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
            textSize === 'large'
              ? 'bg-white text-calm-800 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={textSize === 'large'}
          title="Texto 18px (Base COGA)"
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => setTextSize('xl')}
          className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
            textSize === 'xl'
              ? 'bg-white text-calm-800 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={textSize === 'xl'}
          title="Texto 21px"
        >
          A++
        </button>
      </div>
    </div>
  );
};
