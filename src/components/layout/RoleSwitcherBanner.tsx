import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resetToSeedData } from '../../services/storage';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentUser, users, loginAsUser } = useAuth();
  const { showSuccess } = useToast();

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer todos los datos a la versión de prueba inicial?')) {
      resetToSeedData();
      showSuccess('Datos restablecidos', 'Se han cargado los datos iniciales de prueba.');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="w3-bar w3-black w3-small w3-padding-small" style={{ fontSize: '12px' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 px-4">
        <div>
          <span className="w3-tag w3-dark-grey font-bold" style={{ marginRight: '6px' }}>ROL:</span>
          <span className="text-white font-bold">{currentUser.name}</span>
          <span className="w3-tag w3-grey font-bold" style={{ marginLeft: '6px', fontSize: '10px' }}>
            {currentUser.role.toUpperCase()}
          </span>
          {currentUser.specialty && (
            <span className="w3-tag w3-light-grey text-black font-bold" style={{ marginLeft: '4px', fontSize: '10px' }}>
              {currentUser.specialty.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="role-select" className="w3-text-grey font-bold">
            Cambiar usuario:
          </label>
          <select
            id="role-select"
            value={currentUser.id}
            onChange={(e) => loginAsUser(e.target.value)}
            className="w3-select w3-dark-grey text-white font-bold w3-border-0"
            style={{ width: 'auto', display: 'inline-block', padding: '3px 8px' }}
          >
            <optgroup label="Administradores">
              {users
                .filter((u) => u.role === 'admin')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (Admin)
                  </option>
                ))}
            </optgroup>
            <optgroup label="Comité Especialista">
              {users
                .filter((u) => u.role === 'committee')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.specialty})
                  </option>
                ))}
            </optgroup>
            <optgroup label="Observadores">
              {users
                .filter((u) => u.role === 'viewer')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (Viewer)
                  </option>
                ))}
            </optgroup>
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="w3-button w3-dark-grey w3-hover-white font-bold"
            style={{ padding: '3px 10px' }}
          >
            Reiniciar demo
          </button>
        </div>
      </div>
    </div>
  );
};
