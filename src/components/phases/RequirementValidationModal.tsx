import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Requirement, ParkRequirement, RequirementStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface RequirementValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: Requirement;
  parkRequirement: ParkRequirement;
  onSave: (status: RequirementStatus, notes: string) => void;
}

export const RequirementValidationModal: React.FC<RequirementValidationModalProps> = ({
  isOpen,
  onClose,
  requirement,
  parkRequirement,
  onSave,
}) => {
  const { currentUser, canValidateSpecialty } = useAuth();
  const [status, setStatus] = useState<RequirementStatus>(parkRequirement.status);
  const [notes, setNotes] = useState(parkRequirement.notes || '');

  const hasSpecialtyPermission = canValidateSpecialty(requirement.specialty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(status, notes);
    onClose();
  };

  const statusOptions = [
    { value: 'pending', label: 'Pendiente de inicio' },
    { value: 'in_progress', label: 'En progreso / En trámite' },
    { value: 'completed', label: 'Completado (Listo para dictamen del comité)' },
    { value: 'validated', label: 'Validado oficialmente por el especialista' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dictamen y Validación de Requisito"
      description={`Especialidad asignada: ${requirement.specialty ? requirement.specialty.toUpperCase() : 'GENERAL'}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 text-sm">{requirement.title}</h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{requirement.description}</p>
        </div>

        {!hasSpecialtyPermission && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Aviso de permisos de especialidad:</p>
              <p>
                Este requisito requiere la validación del especialista en{' '}
                <strong>{requirement.specialty}</strong> o de un Administrador. Tu perfil actual solo
                puede visualizar o dejar notas informativas.
              </p>
            </div>
          </div>
        )}

        <Select
          label="Estatus del Requisito"
          value={status}
          onChange={(e) => setStatus(e.target.value as RequirementStatus)}
          options={statusOptions}
          disabled={!hasSpecialtyPermission}
        />

        <div className="space-y-1.5">
          <label htmlFor="notes-textarea" className="block text-sm font-medium text-slate-700">
            Notas de auditoría y dictamen técnico
          </label>
          <textarea
            id="notes-textarea"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe las observaciones técnicas, número de oficio o detalles de la verificación física..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
          />
        </div>

        {parkRequirement.validatedBy && (
          <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            Última validación registrada por: <strong>{parkRequirement.validatedByName || parkRequirement.validatedBy}</strong> el{' '}
            {parkRequirement.validatedAt ? new Date(parkRequirement.validatedAt).toLocaleDateString('es-MX') : 'Fecha no registrada'}.
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={!hasSpecialtyPermission}>
            Guardar Dictamen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
