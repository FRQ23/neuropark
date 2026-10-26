import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Requirement, CommitteeSpecialty } from '../../types';

interface RequirementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (req: Partial<Requirement>) => void;
  requirement?: Requirement | null;
  phaseCode: string;
}

export const RequirementFormModal: React.FC<RequirementFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  requirement,
  phaseCode,
}) => {
  const [title, setTitle] = useState(requirement?.title || '');
  const [description, setDescription] = useState(requirement?.description || '');
  const [specialty, setSpecialty] = useState<CommitteeSpecialty | 'general'>(
    requirement?.specialty || 'general'
  );
  const [isExample, setIsExample] = useState(requirement?.isExample ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: requirement?.id,
      title: title.trim(),
      description: description.trim(),
      specialty,
      phaseCode,
      isExample,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={requirement ? 'Editar Requisito' : 'Nuevo Requisito de Fase'}
      description="Como administrador, puedes definir requisitos específicos según normativas reales o personalizadas."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Título del requisito"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Dictamen de sonoridad y aislamiento acústico"
          required
        />

        <div className="w3-margin-bottom">
          <label htmlFor="req-desc" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Descripción detallada y criterio de aceptación</b>
          </label>
          <textarea
            id="req-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Especifica los documentos requeridos o las condiciones físicas esperadas..."
            className="w3-input w3-border"
            required
          />
        </div>

        <Select
          label="Especialidad responsable de la validación"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value as CommitteeSpecialty | 'general')}
          options={[
            { value: 'education', label: 'Educación (Pedagogía y desarrollo neurodivergente)' },
            { value: 'psychology', label: 'Psicología (Bienestar sensorial y emocional)' },
            { value: 'finance', label: 'Finanzas (Presupuesto, costos y auditoría)' },
            { value: 'general', label: 'General / Permisos de Gobierno' },
          ]}
        />

        <div style={{ margin: '12px 0' }}>
          <label htmlFor="is-example-check" className="w3-small" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              id="is-example-check"
              className="w3-check"
              checked={isExample}
              onChange={(e) => setIsExample(e.target.checked)}
            />
            <span>Marcar con distintivo de <em>"Requisito de ejemplo"</em> (placeholder de prueba)</span>
          </label>
        </div>

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {requirement ? 'Actualizar Requisito' : 'Crear Requisito'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
