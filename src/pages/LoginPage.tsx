import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginAsUser, users } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@neuroparque.org');
  const [password, setPassword] = useState('password123');
  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginWithEmail(email);
    if (success) {
      showSuccess('Sesión iniciada con éxito', `Bienvenido al sistema NeuroParque.`);
      navigate(from, { replace: true });
    } else {
      showError('Credenciales no válidas', 'Selecciona uno de los usuarios de prueba disponibles abajo.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    loginAsUser(userId);
    const user = users.find((u) => u.id === userId);
    showSuccess('Inicio de sesión rápido', `Ingresaste como ${user?.name} (${user?.role}).`);
    navigate(from, { replace: true });
  };

  return (
    <div className="w3-container" style={{ maxWidth: '650px', margin: '48px auto' }}>
      <div className="w3-center w3-margin-bottom">
        <p>
          <i className="fa fa-tree w3-xxxlarge"></i>
        </p>
        <h1 className="w3-xxlarge w3-wide">NEUROPARQUE B.C.</h1>
        <p className="w3-text-grey" style={{ lineHeight: '1.6' }}>
          Sistema de gestión y seguimiento de adecuación de parques inclusivos para personas neurodivergentes
        </p>
      </div>

      <div className="w3-border w3-white w3-container w3-padding-32 w3-margin-bottom" style={{ borderColor: '#e5e7eb' }}>
        <form onSubmit={handleLogin}>
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@neuroparque.org"
            required
          />

          <Input
            label="Contraseña de acceso"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" className="w3-block w3-margin-top" rightIcon={<i className="fa fa-arrow-right"></i>}>
            Ingresar al Tablero
          </Button>
        </form>

        {/* Quick Login Profiles for Evaluator */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
          <p className="w3-small font-bold w3-wide" style={{ margin: '0 0 8px 0' }}>
            <i className="fa fa-info-circle w3-margin-right"></i>
            ACCESO RÁPIDO PARA EVALUACIÓN (SELECCIONA UN ROL):
          </p>

          <p className="w3-tiny w3-text-grey" style={{ margin: '0 0 16px 0' }}>
            Haz clic en cualquiera de los usuarios preconfigurados para iniciar sesión inmediatamente con sus permisos específicos:
          </p>

          <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
            {users.map((user) => (
              <div key={user.id} className="w3-col l6 m6 s12 w3-margin-bottom">
                <button
                  type="button"
                  onClick={() => handleQuickLogin(user.id)}
                  className="w3-button w3-light-grey w3-border w3-block w3-left-align"
                  style={{ padding: '10px' }}
                >
                  <b className="w3-small w3-block">{user.name}</b>
                  <div style={{ marginTop: '4px' }}>
                    <Badge role={user.role} size="sm" />
                    {user.specialty && (
                      <span style={{ marginLeft: '4px' }}>
                        <Badge specialty={user.specialty} size="sm" />
                      </span>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w3-center w3-tiny w3-text-grey">
        <p>Proyecto de Maestría en Gestión de TIC — UABC</p>
        <p>Caso de estudio: Parque Cooper, Ensenada, B.C.</p>
      </div>
    </div>
  );
};
