import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { resetToSeedData } from '../services/storage';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  RotateCcw,
  LogOut,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todos los catálogos y datos al estado inicial de prueba?')) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card-calm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-calm-200 shadow-soft"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{currentUser.name}</h1>
              <Badge role={currentUser.role} />
              {currentUser.specialty && <Badge specialty={currentUser.specialty} />}
            </div>

            <p className="text-sm text-slate-600">{currentUser.institution}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser.email}
              </span>
              {currentUser.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {currentUser.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Button variant="danger" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Permissions matrix for current role */}
      <div className="card-calm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-calm-600" />
          <span>Matriz de Privilegios para tu Rol ({currentUser.role.toUpperCase()})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-800 text-sm">Administración General</p>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-1.5">
                {currentUser.role === 'admin' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Crear y editar nuevos parques</span>
              </li>
              <li className="flex items-center gap-1.5">
                {currentUser.role === 'admin' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Crear y modificar áreas y categorías</span>
              </li>
              <li className="flex items-center gap-1.5">
                {currentUser.role === 'admin' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Clonar plantillas de replicabilidad</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-800 text-sm">Validación Técnica y Dictamen</p>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-1.5">
                {currentUser.role === 'admin' || currentUser.role === 'committee' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Validar requisitos de su especialidad</span>
              </li>
              <li className="flex items-center gap-1.5">
                {currentUser.role === 'admin' || currentUser.role === 'committee' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Marcar cambios físicos en campo</span>
              </li>
              <li className="flex items-center gap-1.5">
                {currentUser.role === 'admin' || currentUser.role === 'committee' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Adjuntar fotos de antes y después</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-800 text-sm">Comunidad y Red</p>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Consultar directorio de asociaciones</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Visualizar tableros y horarios</span>
              </li>
              <li className="flex items-center gap-1.5">
                {currentUser.role === 'admin' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300" />
                )}
                <span>Habilitar apertura oficial del parque</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Database Maintenance */}
      <div className="card-calm p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Mantenimiento de Prototipo</h3>
        <p className="text-xs text-slate-600">
          Si modificaste registros o realizaste pruebas y deseas restablecer la base de datos simulada en
          localStorage a los valores iniciales de prueba (Parque Cooper, 3 fases, comités y asociaciones):
        </p>
        <Button variant="secondary" size="sm" onClick={handleResetData} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Restablecer Base de Datos a Semilla Inicial
        </Button>
      </div>
    </div>
  );
};
