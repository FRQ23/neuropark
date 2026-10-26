import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
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
      <div className="w3-container w3-white w3-card w3-padding-32 w3-center w3-margin-top" style={{ maxWidth: '600px', margin: '48px auto' }}>
        <p>
          <i className="fa fa-shield w3-xxxlarge w3-text-dark-grey" aria-hidden="true"></i>
        </p>
        <h3 className="w3-wide">ACCESO RESTRINGIDO A ADMINISTRADORES</h3>
        <p className="w3-text-grey" style={{ lineHeight: '1.8' }}>
          Esta sección requiere privilegios de Administrador para modificar catálogos del sistema.
          Tu usuario actual tiene rol de <b>{currentUser.role}</b>.
        </p>
        <p className="w3-small w3-text-grey">
          Tip: Puedes cambiar tu rol a Administrador usando el selector en la barra superior.
        </p>
        <div style={{ marginTop: '24px' }}>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Regresar a la pantalla anterior
          </Button>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="w3-container w3-white w3-card w3-padding-32 w3-center w3-margin-top" style={{ maxWidth: '600px', margin: '48px auto' }}>
        <p>
          <i className="fa fa-ban w3-xxxlarge w3-text-red" aria-hidden="true"></i>
        </p>
        <h3 className="w3-wide">PERMISOS INSUFICIENTES</h3>
        <p className="w3-text-grey">
          No tienes el rol requerido para visualizar este módulo.
        </p>
        <div style={{ marginTop: '24px' }}>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Regresar
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
