import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { scheduleApi, parkApi } from '../services/api';
import { ParkSchedule, Park } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PhaseNavTabs } from '../components/phases/PhaseNavTabs';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ScheduleModal } from '../components/schedules/ScheduleModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Clock, Plus, Edit2, Trash2, ShieldAlert, CheckCircle2, VolumeX, Dog, Sun, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SchedulesPage: React.FC = () => {
  const { parkId = 'park-ensenada-cooper' } = useParams<{ parkId: string }>();
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [park, setPark] = useState<Park | null>(null);
  const [schedules, setSchedules] = useState<ParkSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ParkSchedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<ParkSchedule | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [parkData, schedsData] = await Promise.all([
        parkApi.getById(parkId),
        scheduleApi.getByPark(parkId),
      ]);
      setPark(parkData || null);
      setSchedules(schedsData);
    } catch (err) {
      console.error('Error loading schedules', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [parkId]);

  const handleSaveSchedule = async (scheduleData: Omit<ParkSchedule, 'id'>) => {
    try {
      if (editingSchedule) {
        await scheduleApi.update(editingSchedule.id, scheduleData);
        showSuccess('Horario actualizado', 'Los cambios en la franja horaria han sido guardados.');
      } else {
        await scheduleApi.create(scheduleData);
        showSuccess('Horario creado', 'Se configuró una nueva franja horaria especial.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showError('Error al guardar horario', err.message);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    try {
      await scheduleApi.delete(scheduleToDelete.id);
      showSuccess('Horario eliminado', 'La franja horaria fue retirada.');
      setScheduleToDelete(null);
      loadData();
    } catch (err: any) {
      showError('Error al eliminar', err.message);
    }
  };

  const handleToggleActive = async (s: ParkSchedule) => {
    try {
      await scheduleApi.update(s.id, { active: !s.active });
      showSuccess(
        !s.active ? 'Horario activado' : 'Horario pausado',
        `El horario se encuentra ${!s.active ? 'activo' : 'en pausa'}.`
      );
      loadData();
    } catch (err: any) {
      showError('Error al actualizar estado', err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando horarios de ambiente controlado..." />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Parques', path: '/parks' },
          { label: park?.name || 'Parque Cooper', path: `/parks/${parkId}` },
          { label: 'Horarios Especiales' },
        ]}
      />

      <PhaseNavTabs parkId={parkId} />

      {/* Explanatory banner based on client transcript */}
      <div className="card-calm p-6 space-y-3 bg-gradient-to-r from-calm-50/90 to-slate-50 border-calm-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-calm-800 bg-calm-100 px-2 py-0.5 rounded">
              Ambiente Regulado
            </span>
            <h1 className="text-2xl font-bold text-slate-800">
              Horarios Exclusivos para Personas Neurodivergentes
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              En las palabras del cliente en la reunión: <em>"Como es un parque regular ahorita, se cambia
              el horario y hay un horario que es específico para neurodivergencias: es otro tipo de ambiente,
              los colores, no va a haber perros, no va a haber gente ruidosa ni maquinaria."</em>
            </p>
          </div>

          {isAdmin && (
            <Button
              onClick={() => {
                setEditingSchedule(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nuevo Horario Especial
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <article
            key={schedule.id}
            aria-label={`Horario: ${schedule.days.join(', ')}`}
            className={`card-calm p-6 flex flex-col justify-between space-y-5 transition-all ${
              schedule.active ? 'border-calm-300 shadow-soft' : 'opacity-70 bg-slate-50'
            }`}
          >
            <div className="space-y-4">
              {/* Header: Days and Active state */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1.5">
                    {schedule.days.map((day) => (
                      <span
                        key={day}
                        className="text-xs font-bold text-calm-900 bg-calm-100 border border-calm-200 px-2.5 py-1 rounded-lg"
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-lg font-bold text-slate-800 pt-1">
                    <Clock className="w-5 h-5 text-calm-600" />
                    <span>
                      {schedule.startTime} — {schedule.endTime} hrs
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      schedule.active
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {schedule.active ? 'Activo' : 'En pausa'}
                  </span>

                  {isAdmin && (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Editar horario"
                        aria-label="Editar horario"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleToDelete(schedule)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Eliminar horario"
                        aria-label="Eliminar horario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Restrictions List */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Condiciones y Restricciones del Entorno:
                </p>
                <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
                  {schedule.restrictions.map((res, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-calm-600 mt-0.5 flex-shrink-0" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              {schedule.notes && (
                <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                  Nota operativa: "{schedule.notes}"
                </p>
              )}
            </div>

            {isAdmin && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Control de publicación:</span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(schedule)}
                  className="text-xs text-calm-700 hover:text-calm-900 font-semibold underline"
                >
                  {schedule.active ? 'Pausar este horario' : 'Reactivar este horario'}
                </button>
              </div>
            )}
          </article>
        ))}

        {schedules.length === 0 && (
          <div className="col-span-2 card-calm p-12 text-center text-slate-500 text-sm">
            No se han registrado horarios especiales para este parque todavía.
          </div>
        )}
      </div>

      {/* Schedule Form Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        parkId={parkId}
        schedule={editingSchedule}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!scheduleToDelete}
        onClose={() => setScheduleToDelete(null)}
        onConfirm={handleDeleteSchedule}
        title="¿Eliminar horario especial?"
        message="¿Estás seguro de que deseas eliminar este horario? Los guardaparques y familias ya no verán esta franja en el calendario."
      />
    </div>
  );
};
