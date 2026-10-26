import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Area } from '../../types';

interface AddAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (area: Omit<Area, 'id'>) => void;
  parkId: string;
}

export const AddAreaModal: React.FC<AddAreaModalProps> = ({ isOpen, onClose, onSave, parkId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      parkId,
      name: name.trim(),
      description: description.trim(),
    });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Área del Parque" maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre del Área"
          placeholder="Ej: Jardín de Aromas y Texturas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="w3-margin-bottom">
          <label htmlFor="area-desc" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Descripción de su función</b>
          </label>
          <textarea
            id="area-desc"
            rows={3}
            placeholder="Zona diseñada para exploración táctil y olfativa con plantas no alérgicas..."
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
            Guardar Área
          </Button>
        </div>
      </form>
    </Modal>
  );
};
