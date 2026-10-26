import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Trees,
  FileCheck2,
  Sliders,
  Signpost,
  Clock,
  HeartHandshake,
  Layers,
  Users2,
  UserCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin } = useAuth();
  const defaultParkId = 'park-ensenada-cooper';

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
      isActive
        ? 'bg-calm-600 text-white shadow-xs font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden backdrop-blur-2xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navegación principal del sistema"
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-calm-600 text-white flex items-center justify-center shadow-soft">
              <Trees className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                NeuroParque
                <span className="text-[10px] bg-calm-100 text-calm-800 font-semibold px-1.5 py-0.5 rounded">
                  B.C.
                </span>
              </span>
              <p className="text-xs text-slate-500">Parques Inclusivos Adaptados</p>
            </div>
          </NavLink>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* General Section */}
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Gestión General
            </p>
            <nav className="space-y-1">
              <NavLink to="/" end className={navLinkClasses} onClick={onClose}>
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                <span>Tablero General</span>
              </NavLink>
              <NavLink to="/parks" end className={navLinkClasses} onClick={onClose}>
                <Trees className="w-4 h-4" aria-hidden="true" />
                <span>Directorio de Parques</span>
              </NavLink>
            </nav>
          </div>

          {/* Ensenada Pilot Park Phases */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Parque Cooper (Piloto)
              </p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.5 rounded-full">
                Ensenada
              </span>
            </div>
            <nav className="space-y-1">
              <NavLink
                to={`/parks/${defaultParkId}`}
                end
                className={navLinkClasses}
                onClick={onClose}
              >
                <Sparkles className="w-4 h-4 text-calm-600" aria-hidden="true" />
                <span>Resumen y Fases</span>
              </NavLink>

              <NavLink
                to={`/parks/${defaultParkId}/phase-1`}
                className={navLinkClasses}
                onClick={onClose}
              >
                <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                <div className="flex-1 text-left truncate">
                  <span>Fase 1: Permisos</span>
                  <p className="text-[11px] opacity-75 font-normal">Lineamientos y gobierno</p>
                </div>
              </NavLink>

              <NavLink
                to={`/parks/${defaultParkId}/phase-2`}
                className={navLinkClasses}
                onClick={onClose}
              >
                <Sliders className="w-4 h-4" aria-hidden="true" />
                <div className="flex-1 text-left truncate">
                  <span>Fase 2: Infraestructura</span>
                  <p className="text-[11px] opacity-75 font-normal">Áreas x Categorías x Color</p>
                </div>
              </NavLink>

              <NavLink
                to={`/parks/${defaultParkId}/phase-3`}
                className={navLinkClasses}
                onClick={onClose}
              >
                <Signpost className="w-4 h-4" aria-hidden="true" />
                <div className="flex-1 text-left truncate">
                  <span>Fase 3: Señalética</span>
                  <p className="text-[11px] opacity-75 font-normal">Emergencia y comunidad</p>
                </div>
              </NavLink>

              <NavLink
                to={`/parks/${defaultParkId}/schedules`}
                className={navLinkClasses}
                onClick={onClose}
              >
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>Horarios Especiales</span>
              </NavLink>
            </nav>
          </div>

          {/* Network & Replicability */}
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Red y Expansión
            </p>
            <nav className="space-y-1">
              <NavLink to="/associations" className={navLinkClasses} onClick={onClose}>
                <HeartHandshake className="w-4 h-4" aria-hidden="true" />
                <span>Asociaciones y Contactos</span>
              </NavLink>
              <NavLink to="/templates" className={navLinkClasses} onClick={onClose}>
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Plantillas por Estado</span>
              </NavLink>
            </nav>
          </div>

          {/* Admin Management Section */}
          {isAdmin && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Administración
              </p>
              <nav className="space-y-1">
                <NavLink to="/users" className={navLinkClasses} onClick={onClose}>
                  <Users2 className="w-4 h-4" aria-hidden="true" />
                  <span>Gestión de Usuarios</span>
                </NavLink>
              </nav>
            </div>
          )}
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser?.role}</p>
            </div>
            <UserCircle className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};
