import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileCheck2, Sliders, Signpost, Clock } from 'lucide-react';

interface PhaseNavTabsProps {
  parkId: string;
}

export const PhaseNavTabs: React.FC<PhaseNavTabsProps> = ({ parkId }) => {
  const tabClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] ${
      isActive
        ? 'bg-calm-700 text-white shadow-xs font-semibold'
        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
    }`;

  return (
    <nav
      aria-label="Pestañas de fases del parque"
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
    >
      <NavLink to={`/parks/${parkId}/phase-1`} className={tabClasses}>
        <FileCheck2 className="w-4 h-4" aria-hidden="true" />
        <span>Fase 1: Permisos</span>
      </NavLink>
      <NavLink to={`/parks/${parkId}/phase-2`} className={tabClasses}>
        <Sliders className="w-4 h-4" aria-hidden="true" />
        <span>Fase 2: Infraestructura y Equipos</span>
      </NavLink>
      <NavLink to={`/parks/${parkId}/phase-3`} className={tabClasses}>
        <Signpost className="w-4 h-4" aria-hidden="true" />
        <span>Fase 3: Señalética</span>
      </NavLink>
      <NavLink to={`/parks/${parkId}/schedules`} className={tabClasses}>
        <Clock className="w-4 h-4" aria-hidden="true" />
        <span>Horarios Especiales</span>
      </NavLink>
    </nav>
  );
};
