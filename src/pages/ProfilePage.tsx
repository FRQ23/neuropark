import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { resetToSeedData } from '../services/storage';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleResetData = () => {
    if (
      window.confirm(
        '¿Deseas restaurar todos los datos a la versión inicial de prueba? Se reiniciarán todos los parques, requisitos, evidencias y asociaciones.'
      )
    ) {
      resetToSeedData();
      showSuccess('Datos restablecidos', 'Se restauraron los datos base de Ensenada.');
      setTimeout(() => window.location.reload(), 400);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="w3-border w3-white w3-container w3-padding-24 w3-margin-bottom" style={{ borderColor: '#e5e7eb' }}>
        <div className="w3-row">
          <div className="w3-col l8 m8 s12">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h1 className="w3-xlarge w3-wide" style={{ margin: 0 }}>{currentUser.name}</h1>
              <Badge role={currentUser.role} />
              {currentUser.specialty && <Badge specialty={currentUser.specialty} />}
            </div>

            <p className="w3-text-grey" style={{ margin: '4px 0' }}>{currentUser.institution}</p>

            <div className="w3-small w3-text-grey" style={{ marginTop: '8px' }}>
              <span style={{ marginRight: '16px' }}>
                <i className="fa fa-envelope w3-margin-right"></i>
                {currentUser.email}
              </span>
              {currentUser.phone && (
                <span>
                  <i className="fa fa-phone w3-margin-right"></i>
                  {currentUser.phone}
                </span>
              )}
            </div>
          </div>

          <div className="w3-col l4 m4 s12 w3-right-align w3-margin-top">
            <Button variant="danger" size="sm" onClick={handleLogout} leftIcon={<i className="fa fa-sign-out"></i>}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Permissions matrix for current role */}
      <div className="w3-border w3-white w3-container w3-padding-24 w3-margin-bottom" style={{ borderColor: '#e5e7eb' }}>
        <h3 className="w3-medium w3-wide" style={{ margin: '0 0 16px 0' }}>
          <i className="fa fa-shield w3-margin-right"></i>
          MATRIZ DE PRIVILEGIOS: {currentUser.role.toUpperCase()}
        </h3>

        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-col l4 m12 s12 w3-margin-bottom">
            <div className="w3-panel w3-light-grey w3-border w3-padding-small w3-small">
              <b>Administración General</b>
              <ul className="w3-ul" style={{ padding: 0 }}>
                <li>
                  <i className={`fa fa-${currentUser.role === 'admin' ? 'check w3-text-green' : 'times w3-text-grey'} w3-margin-right`}></i>
                  Crear y editar nuevos parques
                </li>
                <li>
                  <i className={`fa fa-${currentUser.role === 'admin' ? 'check w3-text-green' : 'times w3-text-grey'} w3-margin-right`}></i>
                  Modificar áreas y categorías
                </li>
                <li>
                  <i className={`fa fa-${currentUser.role === 'admin' ? 'check w3-text-green' : 'times w3-text-grey'} w3-margin-right`}></i>
                  Clonar plantillas de replicabilidad
                </li>
              </ul>
            </div>
          </div>

          <div className="w3-col l4 m12 s12 w3-margin-bottom">
            <div className="w3-panel w3-light-grey w3-border w3-padding-small w3-small">
              <b>Validación Técnica y Dictamen</b>
              <ul className="w3-ul" style={{ padding: 0 }}>
                <li>
                  <i className={`fa fa-${currentUser.role === 'admin' || currentUser.role === 'committee' ? 'check w3-text-green' : 'times w3-text-grey'} w3-margin-right`}></i>
                  Validar requisitos de su especialidad
                </li>
                <li>
                  <i className={`fa fa-${currentUser.role === 'admin' || currentUser.role === 'committee' ? 'check w3-text-green' : 'times w3-text-grey'} w3-margin-right`}></i>
                  Marcar cambios físicos en campo
                </li>
                <li>
                  <i className={`fa fa-${currentUser.role === 'admin' || currentUser.role === 'committee' ? 'check w3-text-green' : 'times w3-text-grey'} w3-margin-right`}></i>
                  Adjuntar fotos de antes y después
                </li>
              </ul>
            </div>
          </div>

          <div className="w3-col l4 m12 s12 w3-margin-bottom">
            <div className="w3-panel w3-light-grey w3-border w3-padding-small w3-small">
              <b>Comunidad y Red</b>
              <ul className="w3-ul" style={{ padding: 0 }}>
                <li>
                  <i className="fa fa-check w3-text-green w3-margin-right"></i>
                  Consultar directorio de asociaciones
                </li>
                <li>
                  <i className="fa fa-check w3-text-green w3-margin-right"></i>
                  Visualizar tableros y horarios
                </li>
                <li>
                  <i className={`fa fa-${currentUser.role === 'admin' ? 'check w3-text-green' : 'times w3-text-grey'} w3-margin-right`}></i>
                  Habilitar apertura oficial del parque
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Database Reset Button */}
      <div style={{ marginTop: '24px', marginBottom: '32px' }}>
        <button
          type="button"
          onClick={handleResetData}
          className="w3-button w3-border w3-white w3-hover-light-grey w3-small"
          style={{ borderColor: '#d1d5db', fontWeight: 'bold' }}
        >
          <i className="fa fa-refresh" style={{ marginRight: '8px' }}></i>
          Restablecer Base de Datos a Semilla Inicial
        </button>
      </div>
    </div>
  );
};
