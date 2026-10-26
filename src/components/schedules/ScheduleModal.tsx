import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ParkSchedule } from '../../types';
import { Plus, X } from 'lucide-react';

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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Days of the week */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Días aplicables</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-calm-700 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  aria-pressed={isSelected}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hours */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Hora de inicio"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            label="Hora de fin"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {/* Restrictions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Reglas y restricciones ambientales
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: Silencio de campanas y bocinas municipales"
              value={newRestriction}
              onChange={(e) => setNewRestriction(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-calm-600 focus:outline-none"
            />
            <Button type="button" size="sm" onClick={addRestriction} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Agregar
            </Button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
            {restrictions.map((res, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
              >
                <span>• {res}</span>
                <button
                  type="button"
                  onClick={() => removeRestriction(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  aria-label="Quitar restricción"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label htmlFor="sched-notes" className="block text-sm font-medium text-slate-700">
            Notas complementarias
          </label>
          <textarea
            id="sched-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Información adicional para los guardaparques y coordinadores..."
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="sched-active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded text-calm-600 focus:ring-calm-500 w-4 h-4"
          />
          <label htmlFor="sched-active" className="text-xs text-slate-700 font-medium select-none">
            Horario activo y publicado en la entrada del parque
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
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
