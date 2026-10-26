import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { NeurodivergenceCategory } from '../../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: Omit<NeurodivergenceCategory, 'id'>) => void;
  category?: NeurodivergenceCategory | null;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
}) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [isExample, setIsExample] = useState(category?.isExample ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      isExample,
    });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Editar Categoría de Neurodivergencia' : 'Nueva Categoría de Neurodivergencia'}
      description="Como administrador, puedes definir categorías técnicas y sus perfiles de necesidad."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la Categoría"
          placeholder="Ej: Procesamiento Visual e Iluminación"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="space-y-1.5">
          <label htmlFor="cat-desc" className="block text-sm font-medium text-slate-700">
            Descripción y necesidades sensoriales/físicas
          </label>
          <textarea
            id="cat-desc"
            rows={3}
            placeholder="Especifica los retos sensoriales o apoyos necesarios para este grupo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="cat-example-check"
            checked={isExample}
            onChange={(e) => setIsExample(e.target.checked)}
            className="rounded text-calm-600 focus:ring-calm-500 w-4 h-4"
          />
          <label htmlFor="cat-example-check" className="text-xs text-slate-600 select-none">
            Marcar como categoría de ejemplo (placeholder de prueba)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar Categoría
          </Button>
        </div>
      </form>
    </Modal>
  );
};
