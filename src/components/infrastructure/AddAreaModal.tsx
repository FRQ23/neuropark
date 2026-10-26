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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Área"
          placeholder="Ej: Jardín de Aromas y Texturas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="space-y-1.5">
          <label htmlFor="area-desc" className="block text-sm font-medium text-slate-700">
            Descripción de su función
          </label>
          <textarea
            id="area-desc"
            rows={3}
            placeholder="Zona diseñada para exploración táctil y olfativa con plantas no alérgicas..."
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
            Guardar Área
          </Button>
        </div>
      </form>
    </Modal>
  );
};
