import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  Brain,
  Eye,
  Type,
  Maximize2,
  Minimize2,
  Sparkles,
  Sliders,
  RotateCcw,
  Check,
  AlignLeft,
  Sun,
  Moon,
  Ban,
  HelpCircle,
} from 'lucide-react';

export const NeuroAssistWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    themeMode,
    setThemeMode,
    textSize,
    setTextSize,
    isDyslexicFont,
    toggleDyslexicFont,
    isReadingRuler,
    toggleReadingRuler,
    isFocusMask,
    toggleFocusMask,
    isExpandedSpacing,
    toggleExpandedSpacing,
    isCogaChunking,
    toggleCogaChunking,
    isReducedMotion,
    toggleReducedMotion,
    resetAccessibilitySettings,
  } = useAccessibility();

  return (
    <>
      {/* Floating NeuroAssist Trigger Button */}
      <aside aria-label="Herramienta de Asistencia Neurodivergente">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-calm-700 hover:bg-calm-800 text-white p-3 sm:px-4 sm:py-3 rounded-2xl shadow-soft-lg flex items-center gap-2.5 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 border border-calm-600/60"
          title="Abrir Asistente de Accesibilidad Cognitiva y NeuroUX"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <Brain className="w-5 h-5 text-calm-200" aria-hidden="true" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            NeuroAssist (COGA)
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
        </button>
      </aside>

      {/* NeuroAssist Settings Dialog */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="🧠 NeuroAssist — Panel de Accesibilidad Cognitiva"
        description="Herramientas adaptativas basadas en directrices W3C COGA y patrones de NeuroUX para dislexia, TDAH y sensibilidad sensorial."
        maxWidth="lg"
      >
        <div className="space-y-6 text-xs text-slate-700 py-1">
          {/* Section 1: Soporte para Dislexia */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-calm-700" />
                <h3 className="font-bold text-sm text-slate-800">Soporte para Dislexia</h3>
              </div>
              <span className="text-[11px] bg-sky-100 text-sky-900 px-2 py-0.5 rounded-full font-semibold">
                OpenDyslexic
              </span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              Activa la fuente <strong>OpenDyslexic</strong> con bases pesadas en las letras para mitigar la rotación involuntaria de caracteres (b, d, p, q).
            </p>

            <button
              type="button"
              onClick={toggleDyslexicFont}
              className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-between transition-colors border ${
                isDyslexicFont
                  ? 'bg-calm-700 text-white border-calm-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              aria-pressed={isDyslexicFont}
            >
              <span>{isDyslexicFont ? '✓ Tipografía OpenDyslexic Activada' : 'Activar Fuente OpenDyslexic'}</span>
              <span className="text-[11px] font-mono opacity-80">Aa Bb Cc</span>
            </button>
          </div>

          {/* Section 2: TDAH y Enfoque de Lectura */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-calm-700" />
              <h3 className="font-bold text-sm text-slate-800">Ayudas de Enfoque y TDAH</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Reading Ruler */}
              <button
                type="button"
                onClick={toggleReadingRuler}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                  isReadingRuler
                    ? 'bg-calm-100 border-calm-400 text-calm-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                aria-pressed={isReadingRuler}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold">Regla de Lectura</span>
                  {isReadingRuler && <Check className="w-4 h-4 text-calm-700" />}
                </div>
                <span className="text-[11px] text-slate-500 font-normal">
                  Franja guía que acompaña el cursor para no perder el renglón.
                </span>
              </button>

              {/* Focus Mask */}
              <button
                type="button"
                onClick={toggleFocusMask}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                  isFocusMask
                    ? 'bg-calm-100 border-calm-400 text-calm-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                aria-pressed={isFocusMask}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold">Máscara de Enfoque</span>
                  {isFocusMask && <Check className="w-4 h-4 text-calm-700" />}
                </div>
                <span className="text-[11px] text-slate-500 font-normal">
                  Atenúa la pantalla alrededor de la línea activa para evitar distracciones.
                </span>
              </button>
            </div>

            {/* W3C COGA Chunking */}
            <div className="pt-2">
              <button
                type="button"
                onClick={toggleCogaChunking}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                  isCogaChunking
                    ? 'bg-calm-100 border-calm-400 text-calm-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                aria-pressed={isCogaChunking}
              >
                <div>
                  <span className="font-bold block">Acotar Líneas a 65 caracteres (W3C COGA)</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Evita saltos de renglón largos que desorientan y cansan la vista.
                  </span>
                </div>
                {isCogaChunking && <Check className="w-4 h-4 text-calm-700 flex-shrink-0 ml-2" />}
              </button>
            </div>
          </div>

          {/* Section 3: Paleta Cromática y Sensibilidad Visual */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">Paleta Cromática de Baja Fatiga</h3>
              <span className="text-[11px] text-slate-500">Sin deslumbramientos</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setThemeMode('warm-paper')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  themeMode === 'warm-paper'
                    ? 'border-calm-600 bg-white shadow-xs font-bold text-slate-900'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white'
                }`}
                aria-pressed={themeMode === 'warm-paper'}
              >
                <div className="w-5 h-5 rounded-full bg-[#f8f7f4] border border-[#dcd9d0] mx-auto mb-1" />
                <span>Papel Cálido (COGA)</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('soft-dark')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  themeMode === 'soft-dark'
                    ? 'border-calm-600 bg-white shadow-xs font-bold text-slate-900'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white'
                }`}
                aria-pressed={themeMode === 'soft-dark'}
              >
                <div className="w-5 h-5 rounded-full bg-[#181a1b] border border-[#33383f] mx-auto mb-1" />
                <span>Oscuro Suave</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('high-contrast')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  themeMode === 'high-contrast'
                    ? 'border-yellow-400 bg-black text-yellow-300 font-bold shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white'
                }`}
                aria-pressed={themeMode === 'high-contrast'}
              >
                <div className="w-5 h-5 rounded-full bg-black border border-yellow-400 mx-auto mb-1" />
                <span>Alto Contraste</span>
              </button>
            </div>
          </div>

          {/* Section 4: Espaciado y Movimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={toggleExpandedSpacing}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                isExpandedSpacing
                  ? 'bg-calm-100 border-calm-400 text-calm-950 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              aria-pressed={isExpandedSpacing}
            >
              <div>
                <span className="font-bold block">Espaciado Amplio</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Mayor separación entre letras y palabras.
                </span>
              </div>
              {isExpandedSpacing && <Check className="w-4 h-4 text-calm-700 ml-2 flex-shrink-0" />}
            </button>

            <button
              type="button"
              onClick={toggleReducedMotion}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                isReducedMotion
              ? 'bg-calm-100 border-calm-400 text-calm-950 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
              aria-pressed={isReducedMotion}
            >
              <div>
                <span className="font-bold block">Pausar Animaciones</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Reducción total de estímulos en movimiento.
                </span>
              </div>
              {isReducedMotion && <Check className="w-4 h-4 text-calm-700 ml-2 flex-shrink-0" />}
            </button>
          </div>

          {/* Section 5: Escala de Tamaño de Texto */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800">Tamaño de Texto General:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTextSize('normal')}
                className={`px-3 py-1.5 rounded-lg font-medium ${
                  textSize === 'normal'
                    ? 'bg-calm-700 text-white font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                16px
              </button>
              <button
                type="button"
                onClick={() => setTextSize('large')}
                className={`px-3 py-1.5 rounded-lg font-medium ${
                  textSize === 'large'
                    ? 'bg-calm-700 text-white font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                18px (Base COGA)
              </button>
              <button
                type="button"
                onClick={() => setTextSize('xl')}
                className={`px-3 py-1.5 rounded-lg font-medium ${
                  textSize === 'xl'
                    ? 'bg-calm-700 text-white font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                21px
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={resetAccessibilitySettings}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer preferencias</span>
          </button>

          <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
            Cerrar y Aplicar
          </Button>
        </div>
      </Modal>
    </>
  );
};
