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
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre de la Categoría"
          placeholder="Ej: Procesamiento Visual e Iluminación"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="w3-margin-bottom">
          <label htmlFor="cat-desc" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Descripción y necesidades sensoriales/físicas</b>
          </label>
          <textarea
            id="cat-desc"
            rows={3}
            placeholder="Especifica los retos sensoriales o apoyos necesarios para este grupo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w3-input w3-border"
            required
          />
        </div>

        <div style={{ margin: '12px 0' }}>
          <label htmlFor="cat-example-check" className="w3-small" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              id="cat-example-check"
              className="w3-check"
              checked={isExample}
              onChange={(e) => setIsExample(e.target.checked)}
            />
            <span>Marcar como categoría de ejemplo (placeholder de prueba)</span>
          </label>
        </div>

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
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
