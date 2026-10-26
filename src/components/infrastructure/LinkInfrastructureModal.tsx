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
      <form onSubmit={handleSubmit}>
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

        <div style={{ margin: '12px 0' }}>
          <label htmlFor="is-completed-box" className="w3-small" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              id="is-completed-box"
              className="w3-check"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            <span>¿La adecuación física o cambio ya fue realizado en campo?</span>
          </label>
        </div>

        <div className="w3-margin-bottom">
          <label htmlFor="link-notes" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Observaciones o especificaciones de instalación</b>
          </label>
          <textarea
            id="link-notes"
            rows={3}
            placeholder="Detalles sobre montaje, anclajes, pruebas de color o contratista..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w3-input w3-border"
          />
        </div>

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
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
