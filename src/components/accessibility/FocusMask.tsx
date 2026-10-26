import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const FocusMask: React.FC = () => {
  const { isFocusMask } = useAccessibility();
  const [mouseY, setMouseY] = useState(300);

  useEffect(() => {
    if (!isFocusMask) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFocusMask]);

  if (!isFocusMask) return null;

  const bandHeight = 70;
  const topCut = Math.max(0, mouseY - bandHeight / 2);
  const bottomCut = mouseY + bandHeight / 2;

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-50">
      {/* Top Dimmed Area */}
      <div
        className="absolute left-0 right-0 top-0 bg-slate-900/40 backdrop-blur-2xs transition-all duration-75"
        style={{ height: `${topCut}px` }}
      />

      {/* Focus Clear Band with subtle borders */}
      <div
        className="absolute left-0 right-0 border-y-2 border-calm-500/60 transition-all duration-75"
        style={{
          top: `${topCut}px`,
          height: `${bandHeight}px`,
          backgroundColor: 'transparent',
        }}
      />

      {/* Bottom Dimmed Area */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-slate-900/40 backdrop-blur-2xs transition-all duration-75"
        style={{ top: `${bottomCut}px` }}
      />
    </div>
  );
};
