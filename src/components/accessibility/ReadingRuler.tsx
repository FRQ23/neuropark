import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const ReadingRuler: React.FC = () => {
  const { isReadingRuler } = useAccessibility();
  const [mouseY, setMouseY] = useState(300);

  useEffect(() => {
    if (!isReadingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReadingRuler]);

  if (!isReadingRuler) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 right-0 pointer-events-none z-50 transition-transform duration-75 ease-out"
      style={{
        top: `${mouseY - 20}px`,
        height: '42px',
        backgroundColor: 'rgba(29, 106, 150, 0.12)',
        borderTop: '2px solid rgba(29, 106, 150, 0.4)',
        borderBottom: '2px solid rgba(29, 106, 150, 0.4)',
        boxShadow: '0 0 12px rgba(29, 106, 150, 0.1)',
      }}
    />
  );
};
