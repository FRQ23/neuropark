import React from 'react';
import { Menu, Trees, MapPin, UserCheck } from 'lucide-react';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left side: hamburger and park indicator */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-600 rounded-xl hover:bg-slate-100 md:hidden focus-visible:outline focus-visible:outline-2"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-calm-50 border border-calm-200 text-xs">
              <MapPin className="w-3.5 h-3.5 text-calm-600" aria-hidden="true" />
              <span className="font-medium text-slate-700">Parque Activo:</span>
              <span className="font-semibold text-calm-800">Parque Cooper (Ensenada, B.C.)</span>
            </div>
          </div>
        </div>

        {/* Right side: Accessibility tools and User info */}
        <div className="flex items-center gap-3">
          <AccessibilityToolbar />

          <div className="h-6 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />

          {currentUser && (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus-visible:outline focus-visible:outline-2"
              title="Ver mi perfil y permisos"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="text-left hidden lg:block">
                <span className="block text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {currentUser.role === 'admin'
                    ? 'Administrador'
                    : currentUser.role === 'committee'
                    ? `Comité (${currentUser.specialty})`
                    : 'Observador'}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
