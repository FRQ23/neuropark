import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Requirement, ParkRequirement, RequirementStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

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
  const { canValidateSpecialty } = useAuth();
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
      <form onSubmit={handleSubmit}>
        <div className="w3-panel w3-light-grey w3-border w3-padding-small w3-margin-bottom">
          <h4 style={{ margin: '4px 0' }}>{requirement.title}</h4>
          <p className="w3-small w3-text-grey" style={{ margin: '4px 0', lineHeight: '1.6' }}>
            {requirement.description}
          </p>
        </div>

        {!hasSpecialtyPermission && (
          <div className="w3-panel w3-pale-yellow w3-leftbar w3-border-yellow w3-padding-small w3-margin-bottom w3-small">
            <p style={{ margin: 0 }}>
              <i className="fa fa-exclamation-triangle w3-margin-right"></i>
              <b>Aviso de permisos de especialidad:</b> Este requisito requiere la validación del especialista en{' '}
              <b>{requirement.specialty}</b> o de un Administrador. Tu perfil actual solo puede visualizar o dejar notas informativas.
            </p>
          </div>
        )}

        <Select
          label="Estatus del Requisito"
          value={status}
          onChange={(e) => setStatus(e.target.value as RequirementStatus)}
          options={statusOptions}
          disabled={!hasSpecialtyPermission}
        />

        <div className="w3-margin-bottom">
          <label htmlFor="notes-textarea" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Notas de auditoría y dictamen técnico</b>
          </label>
          <textarea
            id="notes-textarea"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe las observaciones técnicas, número de oficio o detalles de la verificación física..."
            className="w3-input w3-border"
          />
        </div>

        {parkRequirement.validatedBy && (
          <div className="w3-panel w3-light-grey w3-tiny w3-padding-small w3-margin-bottom">
            Última validación registrada por: <b>{parkRequirement.validatedByName || parkRequirement.validatedBy}</b> el{' '}
            {parkRequirement.validatedAt ? new Date(parkRequirement.validatedAt).toLocaleDateString('es-MX') : 'Fecha no registrada'}.
          </div>
        )}

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
            Cerrar
          </Button>
          <Button type="submit" variant="primary" disabled={!hasSpecialtyPermission}>
            Guardar Dictamen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
