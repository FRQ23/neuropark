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
      <form onSubmit={handleSubmit}>
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
            { value: 'equipment', label: 'Aparato / Equipamiento Especial' },
            { value: 'infrastructure', label: 'Infraestructura / Adecuación Física' },
            { value: 'color_spec', label: 'Especificación Cromática (Color de bajo estímulo)' },
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

        <div className="w3-margin-bottom">
          <label htmlFor="inf-desc" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Propósito y beneficio neurodivergente</b>
          </label>
          <textarea
            id="inf-desc"
            rows={3}
            placeholder="Aporta contención corporal y reduce el sobreestímulo visual durante el juego..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w3-input w3-border"
          />
        </div>

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
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
