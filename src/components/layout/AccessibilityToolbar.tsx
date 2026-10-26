import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Type } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const { highContrast, toggleHighContrast, textSize, setTextSize } = useAccessibility();

  return (
    <div
      aria-label="Herramientas de visualización"
      className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-300"
    >
      <button
        type="button"
        onClick={toggleHighContrast}
        className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
          highContrast ? 'w3-black text-white' : 'text-slate-700 hover:bg-white'
        }`}
        title="Alternar contraste"
      >
        <Eye className="w-3.5 h-3.5 inline mr-1" />
        <span className="hidden sm:inline">Contraste</span>
      </button>

      <span className="w-px h-3 bg-slate-300" />

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setTextSize('normal')}
          className={`px-2 py-0.5 text-xs font-bold rounded ${
            textSize === 'normal' ? 'bg-white shadow-xs' : 'text-slate-600 hover:text-black'
          }`}
        >
          A
        </button>
        <button
          type="button"
          onClick={() => setTextSize('large')}
          className={`px-2 py-0.5 text-xs font-bold rounded ${
            textSize === 'large' ? 'bg-white shadow-xs' : 'text-slate-600 hover:text-black'
          }`}
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => setTextSize('xl')}
          className={`px-2 py-0.5 text-xs font-bold rounded ${
            textSize === 'xl' ? 'bg-white shadow-xs' : 'text-slate-600 hover:text-black'
          }`}
        >
          A++
        </button>
      </div>
    </div>
  );
};
