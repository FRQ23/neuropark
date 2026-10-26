import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Trees, ShieldCheck, UserCheck, ArrowRight, Info } from 'lucide-react';
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
    <div className="min-h-screen bg-canvas-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-calm-600 text-white items-center justify-center shadow-soft-lg mb-4">
          <Trees className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          NeuroParque B.C.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sistema de gestión y seguimiento de adecuación de parques inclusivos para personas neurodivergentes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="card-calm p-6 sm:p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
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

            <Button type="submit" variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Ingresar al Tablero
            </Button>
          </form>

          {/* Quick Login Profiles for Evaluator */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              <Info className="w-4 h-4 text-calm-600" />
              <span>Acceso Rápido para Pruebas (Selecciona un Rol)</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Haz clic en cualquiera de los usuarios preconfigurados para iniciar sesión inmediatamente con sus permisos específicos:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-calm-400 hover:bg-calm-50/60 transition-all text-left bg-white shadow-2xs group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:border-calm-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-calm-800">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge role={user.role} size="sm" />
                      {user.specialty && (
                        <span className="text-[10px] text-slate-600 font-medium capitalize">
                          {user.specialty}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Proyecto de Maestría en Gestión de TIC — UABC</p>
          <p>Caso de estudio: Parque Cooper, Ensenada, B.C.</p>
        </div>
      </div>
    </div>
  );
};
