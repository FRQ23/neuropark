import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Infrastructure, InfrastructureType } from '../../types';

interface AddInfrastructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (inf: Omit<Infrastructure, 'id'>) => void;
}

export const AddInfrastructureModal: React.FC<AddInfrastructureModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<InfrastructureType>('equipment');
  const [colorOrSpec, setColorOrSpec] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !colorOrSpec.trim()) return;
    onSave({
      name: name.trim(),
      type,
      colorOrSpec: colorOrSpec.trim(),
      description: description.trim(),
    });
    setName('');
    setColorOrSpec('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Elemento de Infraestructura, Equipo o Color"
      description="Registra un aparato especial, adecuación física o especificación cromática de bajo estímulo."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del elemento"
          placeholder="Ej: Columpio nido con sujeción lateral"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Select
          label="Tipo de elemento"
          value={type}
          onChange={(e) => setType(e.target.value as InfrastructureType)}
          options={[
            { value: 'equipment', label: '🎡 Aparato / Equipamiento Especial' },
            { value: 'infrastructure', label: '🏗️ Infraestructura / Adecuación Física' },
            { value: 'color_spec', label: '🎨 Especificación Cromática (Color de bajo estímulo)' },
          ]}
        />

        <Input
          label="Especificación técnica o código de color"
          placeholder="Ej: #7A9C8C Verde salvia mate anti-reflejante / Caucho EPDM 40mm"
          value={colorOrSpec}
          onChange={(e) => setColorOrSpec(e.target.value)}
          required
          helperText="Menciona textura, código HEX, o estándar físico."
        />

        <div className="space-y-1.5">
          <label htmlFor="inf-desc" className="block text-sm font-medium text-slate-700">
            Propósito y beneficio neurodivergente
          </label>
          <textarea
            id="inf-desc"
            rows={3}
            placeholder="Aporta contención corporal y reduce el sobreestímulo visual durante el juego..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar Elemento
          </Button>
        </div>
      </form>
    </Modal>
  );
};
