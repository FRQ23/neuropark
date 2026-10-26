import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcherBanner } from './RoleSwitcherBanner';
import {
  Trees,
  Menu,
  X,
  LayoutDashboard,
  FileCheck2,
  Sliders,
  Signpost,
  Clock,
  HeartHandshake,
  Layers,
  Users2,
  UserCircle,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const defaultParkId = 'park-ensenada-cooper';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w3-bar-item w3-button text-xs font-bold uppercase tracking-wider transition-colors py-3 px-3.5 flex items-center gap-1.5 ${
      isActive ? 'w3-black text-white font-bold' : 'text-slate-700 hover:w3-light-grey'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Demo Banner for easy role switching */}
      <RoleSwitcherBanner />

      {/* Main W3.CSS Navbar on top */}
      <header className="sticky top-0 z-40 w3-white w3-card border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 font-extrabold tracking-wider text-base sm:text-lg uppercase hover:opacity-90"
          >
            <div className="w-9 h-9 rounded bg-black text-white flex items-center justify-center font-bold">
              <Trees className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold">NEUROPARQUE</span>
            <span className="hidden sm:inline text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-semibold">
              ENSENADA, B.C.
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navegación Principal">
            <NavLink to="/" end className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Tablero</span>
            </NavLink>

            <NavLink to="/parks" end className={navLinkClass}>
              <Trees className="w-4 h-4" />
              <span>Parques</span>
            </NavLink>

            <NavLink to={`/parks/${defaultParkId}/phase-1`} className={navLinkClass}>
              <FileCheck2 className="w-4 h-4" />
              <span>Fase 1</span>
            </NavLink>

            <NavLink to={`/parks/${defaultParkId}/phase-2`} className={navLinkClass}>
              <Sliders className="w-4 h-4" />
              <span>Fase 2</span>
            </NavLink>

            <NavLink to={`/parks/${defaultParkId}/phase-3`} className={navLinkClass}>
              <Signpost className="w-4 h-4" />
              <span>Fase 3</span>
            </NavLink>

            <NavLink to={`/parks/${defaultParkId}/schedules`} className={navLinkClass}>
              <Clock className="w-4 h-4" />
              <span>Horarios</span>
            </NavLink>

            <NavLink to="/associations" className={navLinkClass}>
              <HeartHandshake className="w-4 h-4" />
              <span>Asociaciones</span>
            </NavLink>

            <NavLink to="/templates" className={navLinkClass}>
              <Layers className="w-4 h-4" />
              <span>Plantillas</span>
            </NavLink>

            {isAdmin && (
              <NavLink to="/users" className={navLinkClass}>
                <Users2 className="w-4 h-4" />
                <span>Usuarios</span>
              </NavLink>
            )}
          </nav>

          {/* User profile button & Mobile menu toggle */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 transition-colors"
                title="Ver perfil"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                />
                <div className="hidden xl:block text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight truncate max-w-[140px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase">{currentUser.role}</p>
                </div>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            className="lg:hidden w3-bar-block w3-black w3-animate-left p-4 space-y-1 text-sm border-t border-slate-800"
            aria-label="Menú Móvil"
          >
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tablero Principal</span>
            </NavLink>

            <NavLink
              to="/parks"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <Trees className="w-4 h-4" />
              <span>Directorio de Parques</span>
            </NavLink>

            <NavLink
              to={`/parks/${defaultParkId}/phase-1`}
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Fase 1: Lineamientos y Permisos</span>
            </NavLink>

            <NavLink
              to={`/parks/${defaultParkId}/phase-2`}
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Fase 2: Infraestructura y Equipamiento</span>
            </NavLink>

            <NavLink
              to={`/parks/${defaultParkId}/phase-3`}
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <Signpost className="w-4 h-4" />
              <span>Fase 3: Señalética y Comunidad</span>
            </NavLink>

            <NavLink
              to={`/parks/${defaultParkId}/schedules`}
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Horarios Especiales</span>
            </NavLink>

            <NavLink
              to="/associations"
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Asociaciones y Contactos</span>
            </NavLink>

            <NavLink
              to="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="w3-bar-item w3-button py-2.5 flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Plantillas de Replicabilidad</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/users"
                onClick={() => setMobileMenuOpen(false)}
                className="w3-bar-item w3-button py-2.5 flex items-center gap-2 text-yellow-300"
              >
                <Users2 className="w-4 h-4" />
                <span>Gestión de Usuarios (Admin)</span>
              </NavLink>
            )}
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8" id="main-content">
        <Outlet />
      </main>

      {/* Footer matching W3.CSS template style */}
      <footer className="w3-center w3-black w3-padding-32 mt-12 text-xs text-slate-400">
        <p className="w3-medium text-white font-bold tracking-wide">
          NEUROPARQUE &copy; 2026 — ADECUACIÓN DE ESPACIOS PÚBLICOS INCLUSIVOS
        </p>
        <p className="mt-1">
          Comité Multidisciplinario de Educación, Psicología y Finanzas • Caso Piloto: Parque Cooper, Ensenada, B.C.
        </p>
        <div className="w3-large w3-section flex items-center justify-center gap-4 text-slate-300">
          <i className="fa fa-facebook-official w3-hover-opacity"></i>
          <i className="fa fa-instagram w3-hover-opacity"></i>
          <i className="fa fa-twitter w3-hover-opacity"></i>
          <i className="fa fa-linkedin w3-hover-opacity"></i>
        </div>
        <p className="text-[11px] text-slate-500">
          Diseño limpio basado en W3.CSS y tipografía Raleway.
        </p>
      </footer>
    </div>
  );
};
