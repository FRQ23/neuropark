import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resetToSeedData } from '../../services/storage';
import { Badge } from '../common/Badge';
import { Users, RotateCcw, ShieldCheck, Eye, GraduationCap, Brain, DollarSign } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentUser, users, loginAsUser } = useAuth();
  const { showSuccess } = useToast();

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer todos los datos a la versión de prueba inicial? Se recargará la página.')) {
      resetToSeedData();
      showSuccess('Datos restablecidos', 'Se han cargado los datos iniciales de prueba.');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }
  };

  if (!currentUser) return null;

  return (
    <aside
      aria-label="Barra de conmutación rápida de roles para prototipo"
      className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-calm-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4 text-calm-400" aria-hidden="true" />
          Prototipo Interactivo:
        </span>
        <span className="text-slate-300">Actualmente explorando como:</span>
        <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          {currentUser.name}
        </span>
        <Badge role={currentUser.role} size="sm" />
        {currentUser.specialty && (
          <Badge specialty={currentUser.specialty} size="sm" />
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <label htmlFor="role-select" className="text-slate-400 font-medium hidden sm:inline">
            Cambiar usuario / rol:
          </label>
          <select
            id="role-select"
            value={currentUser.id}
            onChange={(e) => loginAsUser(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-calm-400 focus:outline-none"
            aria-label="Seleccionar usuario de prueba"
          >
            <optgroup label="Administradores (Control Total)">
              {users
                .filter((u) => u.role === 'admin')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (Admin)
                  </option>
                ))}
            </optgroup>
            <optgroup label="Comité Especialista (Valida su especialidad)">
              {users
                .filter((u) => u.role === 'committee')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Observadores (Solo Lectura)">
              {users
                .filter((u) => u.role === 'viewer')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (Solo lectura)
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
          title="Restablecer datos originales de prueba"
          aria-label="Restablecer datos originales"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reiniciar demo</span>
        </button>
      </div>
    </aside>
  );
};
