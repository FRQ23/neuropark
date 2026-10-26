import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/common/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAdmin = false,
}) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return (
      <div className="card-calm p-8 max-w-lg mx-auto text-center space-y-4 my-12">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Acceso restringido a Administradores</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Esta sección requiere privilegios de Administrador para crear, editar o eliminar catálogos del
          sistema. Tu usuario actual tiene rol de{' '}
          <span className="font-semibold">{currentUser.role}</span>.
        </p>
        <p className="text-xs text-slate-400">
          Tip para evaluador: Puedes cambiar a un rol de Administrador usando el selector en la barra superior.
        </p>
        <div className="pt-2">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Regresar a la pantalla anterior
          </Button>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="card-calm p-8 max-w-lg mx-auto text-center space-y-4 my-12">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Permisos insuficientes</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          No tienes el rol requerido para visualizar este módulo.
        </p>
        <div className="pt-2">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Regresar
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
