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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título del requisito"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Dictamen de sonoridad y aislamiento acústico"
          required
        />

        <div className="space-y-1.5">
          <label htmlFor="req-desc" className="block text-sm font-medium text-slate-700">
            Descripción detallada y criterio de aceptación
          </label>
          <textarea
            id="req-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Especifica los documentos requeridos o las condiciones físicas esperadas..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
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

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is-example-check"
            checked={isExample}
            onChange={(e) => setIsExample(e.target.checked)}
            className="rounded text-calm-600 focus:ring-calm-500 w-4 h-4"
          />
          <label htmlFor="is-example-check" className="text-xs text-slate-600 select-none">
            Marcar con distintivo de <em>"Requisito de ejemplo"</em> (placeholder de prueba)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
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
