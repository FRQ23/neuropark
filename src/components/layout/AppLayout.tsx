import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcherBanner } from './RoleSwitcherBanner';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();
  const defaultParkId = 'park-ensenada-cooper';

  const isPhaseActive = location.pathname.includes('/phase-');
  const isProfileActive = location.pathname === '/profile';

  const getShortName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) return parts[0];
    const firstLower = parts[0].toLowerCase();
    if (
      firstLower.startsWith('ing') ||
      firstLower.startsWith('lic') ||
      firstLower.startsWith('dr') ||
      firstLower.startsWith('mtro')
    ) {
      return `${parts[0]} ${parts[1]}`;
    }
    return parts[0];
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `desktop-nav-link ${
      isActive ? 'w3-black font-bold' : 'text-slate-800 w3-hover-light-grey'
    }`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Demo Banner for easy role switching */}
      <RoleSwitcherBanner />

      {/* Main Navbar on top */}
      <div className="w3-white w3-border-bottom" style={{ borderColor: '#e5e7eb' }}>
        <div
          className="max-w-7xl mx-auto flex items-center justify-between"
          id="myNavbar"
          style={{ width: '100%', padding: '0 12px' }}
        >
          {/* Brand Logo: fixed minimum width, never shrinks, separated from menu */}
          <Link
            to="/"
            className="w3-button w3-wide font-extrabold flex items-center"
            style={{
              flexShrink: 0,
              minWidth: '175px',
              whiteSpace: 'nowrap',
              marginRight: '16px',
              padding: '14px 10px',
              letterSpacing: '2px',
              textDecoration: 'none',
            }}
            title="NEUROPARQUE Inicio"
          >
            <i className="fa fa-tree" style={{ marginRight: '8px', fontSize: '18px' }}></i>
            <span style={{ fontWeight: 800 }}>NEUROPARQUE</span>
          </Link>

          {/* Desktop Links (Responsive, fits comfortably without horizontal clipping) */}
          <div
            className="hidden lg:flex items-center"
            style={{
              marginLeft: 'auto',
              flexShrink: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <NavLink to="/" end className={navLinkClass}>
              <i className="fa fa-dashboard" style={{ marginRight: '6px' }}></i>TABLERO
            </NavLink>
            <NavLink to="/parks" end className={navLinkClass}>
              <i className="fa fa-tree" style={{ marginRight: '6px' }}></i>PARQUES
            </NavLink>

            {/* Dropdown Fases de Adecuación */}
            <div className="w3-dropdown-hover" style={{ backgroundColor: 'transparent' }}>
              <button
                type="button"
                className={`desktop-nav-link ${
                  isPhaseActive ? 'w3-black font-bold' : 'text-slate-800 w3-hover-light-grey'
                }`}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <i className="fa fa-tasks" style={{ marginRight: '6px' }}></i>
                FASES <i className="fa fa-caret-down" style={{ marginLeft: '4px' }}></i>
              </button>
              <div
                className="w3-dropdown-content w3-bar-block w3-border w3-white"
                style={{ minWidth: '220px', zIndex: 100, border: '1px solid #d1d5db' }}
              >
                <NavLink
                  to={`/parks/${defaultParkId}/phase-1`}
                  className={({ isActive }) =>
                    `w3-bar-item w3-button ${isActive ? 'w3-black font-bold' : 'w3-hover-light-grey'}`
                  }
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  <i className="fa fa-check-square-o" style={{ marginRight: '8px' }}></i>
                  Fase 1: Permisos y Legal
                </NavLink>
                <NavLink
                  to={`/parks/${defaultParkId}/phase-2`}
                  className={({ isActive }) =>
                    `w3-bar-item w3-button ${isActive ? 'w3-black font-bold' : 'w3-hover-light-grey'}`
                  }
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  <i className="fa fa-cogs" style={{ marginRight: '8px' }}></i>
                  Fase 2: Infraestructura
                </NavLink>
                <NavLink
                  to={`/parks/${defaultParkId}/phase-3`}
                  className={({ isActive }) =>
                    `w3-bar-item w3-button ${isActive ? 'w3-black font-bold' : 'w3-hover-light-grey'}`
                  }
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  <i className="fa fa-map-signs" style={{ marginRight: '8px' }}></i>
                  Fase 3: Señalética
                </NavLink>
              </div>
            </div>

            <NavLink to={`/parks/${defaultParkId}/schedules`} className={navLinkClass}>
              <i className="fa fa-clock-o" style={{ marginRight: '6px' }}></i>HORARIOS
            </NavLink>
            <NavLink to="/associations" className={navLinkClass}>
              <i className="fa fa-handshake-o" style={{ marginRight: '6px' }}></i>ASOCIACIONES
            </NavLink>
            <NavLink to="/templates" className={navLinkClass}>
              <i className="fa fa-clone" style={{ marginRight: '6px' }}></i>PLANTILLAS
            </NavLink>
            {isAdmin && (
              <NavLink to="/users" className={navLinkClass}>
                <i className="fa fa-users" style={{ marginRight: '6px' }}></i>USUARIOS
              </NavLink>
            )}
          </div>

          {/* User Profile and Mobile Hamburger - ALWAYS visible and pinned to right */}
          <div className="flex items-center" style={{ marginLeft: '12px', flexShrink: 0 }}>
            {currentUser && (
              <Link
                to="/profile"
                className={`w3-button flex items-center font-bold ${
                  isProfileActive ? 'w3-black' : 'w3-light-grey w3-hover-grey'
                }`}
                style={{
                  padding: '9px 13px',
                  fontSize: '13px',
                  border: '1px solid #d1d5db',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                }}
                title={`Mi Perfil (${currentUser.name})`}
              >
                <i className="fa fa-user" style={{ marginRight: '6px' }}></i>
                <span>{getShortName(currentUser.name)}</span>
              </Link>
            )}

            {/* Mobile hamburger button */}
            <button
              type="button"
              className="w3-button lg:hidden"
              style={{ marginLeft: '8px', padding: '9px 13px' }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              title="Abrir menú"
              aria-label="Abrir menú de navegación"
            >
              <i className="fa fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="w3-bar-block w3-black lg:hidden">
            <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-dashboard" style={{ marginRight: '8px' }}></i>TABLERO
            </NavLink>
            <NavLink to="/parks" end onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-tree" style={{ marginRight: '8px' }}></i>PARQUES
            </NavLink>
            <NavLink to={`/parks/${defaultParkId}/phase-1`} onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-check-square-o" style={{ marginRight: '8px' }}></i>FASE 1: PERMISOS
            </NavLink>
            <NavLink to={`/parks/${defaultParkId}/phase-2`} onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-cogs" style={{ marginRight: '8px' }}></i>FASE 2: INFRAESTRUCTURA
            </NavLink>
            <NavLink to={`/parks/${defaultParkId}/phase-3`} onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-map-signs" style={{ marginRight: '8px' }}></i>FASE 3: SEÑALÉTICA
            </NavLink>
            <NavLink to={`/parks/${defaultParkId}/schedules`} onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-clock-o" style={{ marginRight: '8px' }}></i>HORARIOS
            </NavLink>
            <NavLink to="/associations" onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-handshake-o" style={{ marginRight: '8px' }}></i>ASOCIACIONES
            </NavLink>
            <NavLink to="/templates" onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
              <i className="fa fa-clone" style={{ marginRight: '8px' }}></i>PLANTILLAS
            </NavLink>
            {isAdmin && (
              <NavLink to="/users" onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button">
                <i className="fa fa-users" style={{ marginRight: '8px' }}></i>USUARIOS
              </NavLink>
            )}
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w3-bar-item w3-button w3-grey">
              <i className="fa fa-user" style={{ marginRight: '8px' }}></i>MI PERFIL ({currentUser?.name})
            </Link>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8" id="main-content">
        <Outlet />
      </main>

      {/* Footer matching W3.CSS template style */}
      <footer className="w3-center w3-black w3-padding-64 mt-12">
        <a href="#myNavbar" className="w3-button w3-light-grey">
          <i className="fa fa-arrow-up w3-margin-right"></i>Al inicio
        </a>
        <div className="w3-xlarge w3-section flex items-center justify-center gap-4 text-white">
          <i className="fa fa-facebook-official w3-hover-opacity"></i>
          <i className="fa fa-instagram w3-hover-opacity"></i>
          <i className="fa fa-snapchat w3-hover-opacity"></i>
          <i className="fa fa-pinterest-p w3-hover-opacity"></i>
          <i className="fa fa-twitter w3-hover-opacity"></i>
          <i className="fa fa-linkedin w3-hover-opacity"></i>
        </div>
        <p className="w3-medium">
          NEUROPARQUE &copy; 2026 — ADECUACIÓN DE ESPACIOS PÚBLICOS INCLUSIVOS
        </p>
        <p className="w3-small w3-text-grey">
          Comité Multidisciplinario de Educación, Psicología y Finanzas • Caso Piloto: Parque Cooper, Ensenada, B.C.
        </p>
      </footer>
    </div>
  );
};
