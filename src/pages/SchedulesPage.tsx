import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { scheduleApi, parkApi } from '../services/api';
import { ParkSchedule, Park } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { ScheduleModal } from '../components/schedules/ScheduleModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
    <div>
      <Breadcrumbs
        items={[
          { label: 'Parques', path: '/parks' },
          { label: park?.name || 'Parque Cooper', path: `/parks/${parkId}` },
          { label: 'Horarios Especiales' },
        ]}
      />

      {/* Explanatory banner based on client transcript */}
      <div className="w3-padding-24" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <div className="w3-row">
          <div className="w3-col l8 m8 s12">
            <span className="w3-tag w3-black w3-small" style={{ marginBottom: '6px', fontWeight: 'bold' }}>
              AMBIENTE REGULADO
            </span>
            <h1 className="w3-xxlarge w3-wide" style={{ margin: '6px 0', fontWeight: 'bold' }}>
              HORARIOS EXCLUSIVOS
            </h1>
            <p className="w3-text-grey" style={{ margin: '4px 0 0 0' }}>
              Programación de horarios protegidos con ambiente sensorial controlado: sin ruidos fuertes, sin mascotas y con estímulos moderados.
            </p>
          </div>

          {isAdmin && (
            <div className="w3-col l4 m4 s12 w3-right-align w3-margin-top">
              <Button
                onClick={() => {
                  setEditingSchedule(null);
                  setIsModalOpen(true);
                }}
                leftIcon={<i className="fa fa-plus"></i>}
              >
                Nuevo Horario
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Schedules */}
      <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
        {schedules.map((schedule) => (
          <div key={schedule.id} className="w3-col l6 m12 s12 w3-margin-bottom">
            <div
              className="w3-border w3-white w3-container w3-padding-16"
              style={{
                borderColor: '#e5e7eb',
                opacity: schedule.active ? 1 : 0.7,
                borderLeft: schedule.active ? '4px solid #000' : '4px solid #ccc',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {schedule.days.map((day) => (
                      <span key={day} className="w3-tag w3-light-grey w3-border w3-small">
                        {day}
                      </span>
                    ))}
                  </div>

                  <h3 className="w3-large w3-wide" style={{ margin: '4px 0' }}>
                    <i className="fa fa-clock-o w3-margin-right"></i>
                    {schedule.startTime} — {schedule.endTime} hrs
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(schedule)}
                    className={`w3-tag w3-button w3-small ${schedule.active ? 'w3-green' : 'w3-grey'}`}
                    style={{ padding: '2px 8px' }}
                  >
                    {schedule.active ? 'Activo' : 'En pausa'}
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setIsModalOpen(true);
                        }}
                        className="w3-button w3-light-grey w3-small"
                        title="Editar horario"
                        style={{ padding: '4px 8px' }}
                      >
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleToDelete(schedule)}
                        className="w3-button w3-hover-red w3-light-grey w3-small"
                        title="Eliminar horario"
                        style={{ padding: '4px 8px' }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Restrictions List */}
              <div style={{ marginTop: '12px' }}>
                <span className="w3-tiny w3-text-grey font-bold w3-wide">
                  CONDICIONES Y RESTRICCIONES DEL ENTORNO:
                </span>
                <div className="w3-panel w3-light-grey w3-border w3-padding-small w3-small" style={{ margin: '6px 0' }}>
                  {schedule.restrictions.map((res, idx) => (
                    <p key={idx} style={{ margin: '3px 0' }}>
                      <i className="fa fa-check w3-margin-right w3-text-green"></i>
                      {res}
                    </p>
                  ))}
                </div>
              </div>

              {schedule.notes && (
                <p className="w3-tiny w3-text-grey" style={{ fontStyle: 'italic', margin: '6px 0 0 0' }}>
                  Nota operativa: "{schedule.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        schedule={editingSchedule}
        parkId={parkId}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!scheduleToDelete}
        onClose={() => setScheduleToDelete(null)}
        onConfirm={handleDeleteSchedule}
        title="Eliminar Franja Horaria"
        message={`¿Seguro que deseas eliminar el horario especial de los ${scheduleToDelete?.days.join(
          ', '
        )}?`}
        confirmLabel="Eliminar"
      />
    </div>
  );
};
