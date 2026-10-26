import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Sun, Type } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const { highContrast, textSize, toggleHighContrast, setTextSize } = useAccessibility();

  return (
    <div
      aria-label="Herramientas de accesibilidad y bajo estímulo"
      className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200"
    >
      {/* High Contrast Toggle */}
      <button
        type="button"
        onClick={toggleHighContrast}
        className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors min-h-[36px] ${
          highContrast
            ? 'bg-black text-yellow-300 font-bold border border-yellow-300 shadow-xs'
            : 'text-slate-700 hover:bg-white hover:shadow-xs'
        }`}
        aria-pressed={highContrast}
        title="Alternar modo de alto contraste para visibilidad reforzada"
      >
        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Alto contraste</span>
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
          title="Tamaño de texto estándar (16px)"
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
          title="Tamaño de texto grande (18px)"
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
          title="Tamaño de texto muy grande (20px)"
        >
          A++
        </button>
      </div>
    </div>
  );
};
