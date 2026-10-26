import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ParkSchedule } from '../../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sched: Omit<ParkSchedule, 'id'>) => void;
  parkId: string;
  schedule?: ParkSchedule | null;
}

const AVAILABLE_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DEFAULT_RESTRICTIONS = [
  'Prohibido el ingreso de perros y mascotas',
  'Entorno sonoro controlado (sin música, silbatos ni altavoces)',
  'Sin trabajos de maquinaria, podadoras ni sopladoras de hojas',
  'Iluminación suave / sin luces estroboscópicas o parpadeantes',
  'Aforo limitado y supervisado por personal capacitado',
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parkId,
  schedule,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(schedule?.days || ['Martes', 'Jueves']);
  const [startTime, setStartTime] = useState(schedule?.startTime || '08:00');
  const [endTime, setEndTime] = useState(schedule?.endTime || '11:00');
  const [restrictions, setRestrictions] = useState<string[]>(
    schedule?.restrictions || DEFAULT_RESTRICTIONS
  );
  const [newRestriction, setNewRestriction] = useState('');
  const [notes, setNotes] = useState(schedule?.notes || '');
  const [active, setActive] = useState(schedule?.active ?? true);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addRestriction = () => {
    if (!newRestriction.trim()) return;
    setRestrictions((prev) => [...prev, newRestriction.trim()]);
    setNewRestriction('');
  };

  const removeRestriction = (index: number) => {
    setRestrictions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      alert('Selecciona al menos un día de la semana.');
      return;
    }

    onSave({
      parkId,
      days: selectedDays,
      startTime,
      endTime,
      restrictions,
      active,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? 'Editar Horario Especial' : 'Nuevo Horario Especial para Neurodivergentes'}
      description="Configura franjas horarias con ambiente controlado, libre de perros y con estímulos atenuados."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        {/* Days of the week */}
        <div className="w3-margin-bottom">
          <label className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '6px' }}>
            <b>Días aplicables</b>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {AVAILABLE_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w3-tag w3-button w3-small ${
                    isSelected ? 'w3-black' : 'w3-light-grey w3-border'
                  }`}
                  style={{ padding: '6px 12px' }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hours */}
        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-half">
            <Input
              label="Hora de inicio"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="w3-half">
            <Input
              label="Hora de fin"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Restrictions */}
        <div className="w3-margin-bottom">
          <label className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Reglas y restricciones ambientales</b>
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="Ej: Silencio de campanas y bocinas municipales"
              value={newRestriction}
              onChange={(e) => setNewRestriction(e.target.value)}
              className="w3-input w3-border"
              style={{ flex: 1 }}
            />
            <Button type="button" size="sm" onClick={addRestriction} leftIcon={<i className="fa fa-plus"></i>}>
              Agregar
            </Button>
          </div>

          <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
            {restrictions.map((res, idx) => (
              <div
                key={idx}
                className="w3-panel w3-light-grey w3-border w3-padding-small w3-small"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}
              >
                <span>• {res}</span>
                <button
                  type="button"
                  onClick={() => removeRestriction(idx)}
                  className="w3-button w3-hover-red w3-tiny"
                  style={{ padding: '2px 6px' }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="w3-margin-bottom">
          <label htmlFor="sched-notes" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Notas complementarias</b>
          </label>
          <textarea
            id="sched-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Información adicional para los guardaparques y coordinadores..."
            className="w3-input w3-border"
          />
        </div>

        {/* Active toggle */}
        <div style={{ margin: '12px 0' }}>
          <label htmlFor="sched-active" className="w3-small" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              id="sched-active"
              className="w3-check"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span>Horario activo y publicado en la entrada del parque</span>
          </label>
        </div>

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar Horario
          </Button>
        </div>
      </form>
    </Modal>
  );
};
