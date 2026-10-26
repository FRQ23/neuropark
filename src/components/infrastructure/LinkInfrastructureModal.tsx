import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Area, NeurodivergenceCategory, Infrastructure, AreaCategoryInfrastructure } from '../../types';

interface LinkInfrastructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AreaCategoryInfrastructure, 'id'>) => void;
  parkId: string;
  areas: Area[];
  categories: NeurodivergenceCategory[];
  infrastructures: Infrastructure[];
  defaultAreaId?: string;
  defaultCategoryId?: string;
}

export const LinkInfrastructureModal: React.FC<LinkInfrastructureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parkId,
  areas,
  categories,
  infrastructures,
  defaultAreaId,
  defaultCategoryId,
}) => {
  const [areaId, setAreaId] = useState(defaultAreaId || (areas[0]?.id || ''));
  const [categoryId, setCategoryId] = useState(defaultCategoryId || (categories[0]?.id || ''));
  const [infrastructureId, setInfrastructureId] = useState(infrastructures[0]?.id || '');
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaId || !categoryId || !infrastructureId) return;

    onSave({
      parkId,
      areaId,
      categoryId,
      infrastructureId,
      isCompleted,
      isValidated: false,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar Requerimiento de Infraestructura a Matriz"
      description="Vincula qué equipo, color o adecuación física se necesita para un área y categoría neurodivergente."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Área del Parque"
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
          options={areas.map((a) => ({ value: a.id, label: a.name }))}
        />

        <Select
          label="Categoría Neurodivergente"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />

        <Select
          label="Equipo, Infraestructura o Color requerido"
          value={infrastructureId}
          onChange={(e) => setInfrastructureId(e.target.value)}
          options={infrastructures.map((i) => ({
            value: i.id,
            label: `[${i.type === 'color_spec' ? 'COLOR' : i.type === 'equipment' ? 'EQUIPO' : 'OBRA'}] ${i.name} - ${i.colorOrSpec}`,
          }))}
        />

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is-completed-box"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="rounded text-calm-600 focus:ring-calm-500 w-4 h-4"
          />
          <label htmlFor="is-completed-box" className="text-xs text-slate-700 font-medium select-none">
            ¿La adecuación física o cambio ya fue realizado en campo?
          </label>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="link-notes" className="block text-sm font-medium text-slate-700">
            Observaciones o especificaciones de instalación
          </label>
          <textarea
            id="link-notes"
            rows={3}
            placeholder="Detalles sobre montaje, anclajes, pruebas de color o contratista..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar en Matriz
          </Button>
        </div>
      </form>
    </Modal>
  );
};
