import React, { useState } from 'react';
import { Requirement, ParkRequirement, RequirementStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EvidenceGallery } from './EvidenceGallery';
import { EvidenceUploadModal } from './EvidenceUploadModal';
import { RequirementValidationModal } from './RequirementValidationModal';
import { useAuth } from '../../context/AuthContext';

interface RequirementItemProps {
  requirement: Requirement;
  parkRequirement: ParkRequirement;
  onUpdateStatus: (parkReqId: string, status: RequirementStatus, notes?: string) => void;
  onAddEvidence: (parkReqId: string, ev: { type: 'before' | 'after'; url: string; caption: string; uploadedBy: string }) => void;
  onDeleteEvidence: (parkReqId: string, evidenceId: string) => void;
  onEditRequirement?: (req: Requirement) => void;
  onDeleteRequirement?: (reqId: string) => void;
}

export const RequirementItem: React.FC<RequirementItemProps> = ({
  requirement,
  parkRequirement,
  onUpdateStatus,
  onAddEvidence,
  onDeleteEvidence,
  onEditRequirement,
  onDeleteRequirement,
}) => {
  const { currentUser, isAdmin, canValidateSpecialty } = useAuth();
  const [showEvidence, setShowEvidence] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const hasSpecialtyPermission = canValidateSpecialty(requirement.specialty);
  const evidenceCount = parkRequirement.evidence?.length || 0;

  const statusBorderClass = {
    pending: 'w3-border-khaki',
    in_progress: 'w3-border-blue',
    completed: 'w3-border-teal',
    validated: 'w3-border-green',
  }[parkRequirement.status];

  return (
    <div
      aria-label={`Requisito: ${requirement.title}`}
      className={`w3-card w3-white w3-container w3-padding-16 w3-margin-bottom w3-leftbar ${statusBorderClass}`}
    >
      {/* Top row: tags, title and status */}
      <div className="w3-row">
        <div className="w3-col l8 m12 s12">
          <div style={{ marginBottom: '6px' }}>
            <Badge status={parkRequirement.status} />
            {requirement.specialty && (
              <span style={{ marginLeft: '6px' }}>
                <Badge specialty={requirement.specialty} size="sm" />
              </span>
            )}
            {requirement.isExample && (
              <span className="w3-tag w3-khaki w3-small" style={{ marginLeft: '6px' }}>
                Placeholder de ejemplo
              </span>
            )}
          </div>
          <h3 style={{ margin: '6px 0' }}>{requirement.title}</h3>
          <p className="w3-text-grey" style={{ margin: '4px 0 12px 0', lineHeight: '1.6' }}>
            {requirement.description}
          </p>
        </div>

        {/* Action button: Validate or update status */}
        <div className="w3-col l4 m12 s12 w3-right-align">
          <Button
            size="sm"
            variant={parkRequirement.status === 'validated' ? 'outline' : 'primary'}
            onClick={() => setIsValidationModalOpen(true)}
            leftIcon={<i className="fa fa-shield"></i>}
            title={
              hasSpecialtyPermission
                ? 'Validar o dictaminar requisito'
                : 'Ver detalles de validación'
            }
          >
            {parkRequirement.status === 'validated' ? 'Ver Dictamen' : 'Validar / Dictaminar'}
          </Button>

          {isAdmin && (
            <span style={{ marginLeft: '8px' }}>
              {onEditRequirement && (
                <button
                  type="button"
                  onClick={() => onEditRequirement(requirement)}
                  className="w3-button w3-light-grey w3-small"
                  title="Editar requisito"
                  style={{ marginRight: '4px' }}
                >
                  <i className="fa fa-pencil"></i>
                </button>
              )}
              {onDeleteRequirement && (
                <button
                  type="button"
                  onClick={() => onDeleteRequirement(requirement.id)}
                  className="w3-button w3-hover-red w3-light-grey w3-small"
                  title="Eliminar requisito"
                >
                  <i className="fa fa-trash"></i>
                </button>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Validation info and notes if present */}
      {(parkRequirement.notes || parkRequirement.validatedBy) && (
        <div className="w3-panel w3-light-grey w3-small w3-padding-small w3-margin-top">
          {parkRequirement.validatedBy && (
            <p className="w3-text-green font-bold" style={{ margin: '4px 0' }}>
              <i className="fa fa-check w3-margin-right"></i>
              Validado oficialmente por{' '}
              <span>{parkRequirement.validatedByName || parkRequirement.validatedBy}</span>
              {parkRequirement.validatedAt && (
                <span className="w3-text-grey" style={{ fontWeight: 'normal', marginLeft: '6px' }}>
                  ({new Date(parkRequirement.validatedAt).toLocaleDateString('es-MX')})
                </span>
              )}
            </p>
          )}
          {parkRequirement.notes && (
            <p className="w3-text-dark-grey" style={{ margin: '4px 0', fontStyle: 'italic' }}>
              <i className="fa fa-comment-o w3-margin-right"></i>
              "{parkRequirement.notes}"
            </p>
          )}
        </div>
      )}

      {/* Evidence trigger bar */}
      <div className="w3-bar w3-border-top w3-margin-top w3-padding-small w3-small">
        <button
          type="button"
          onClick={() => setShowEvidence((prev) => !prev)}
          className="w3-button w3-light-grey"
          style={{ padding: '4px 8px' }}
          aria-expanded={showEvidence}
        >
          <i className="fa fa-camera w3-margin-right"></i>
          Evidencia fotográfica ({evidenceCount}){' '}
          <i className={`fa fa-chevron-${showEvidence ? 'up' : 'down'} w3-margin-left`}></i>
        </button>

        {!currentUser?.role || currentUser.role !== 'viewer' ? (
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="w3-button w3-right"
            style={{ padding: '4px 8px' }}
          >
            <i className="fa fa-plus w3-margin-right"></i>Adjuntar foto Antes/Después
          </button>
        ) : null}
      </div>

      {/* Expandable Evidence Gallery */}
      {showEvidence && (
        <div style={{ marginTop: '12px' }}>
          <EvidenceGallery
            evidence={parkRequirement.evidence || []}
            canEdit={!currentUser?.role || currentUser.role !== 'viewer'}
            onDeleteEvidence={(evidenceId) => onDeleteEvidence(parkRequirement.id, evidenceId)}
          />
        </div>
      )}

      {/* Modals */}
      <EvidenceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={(ev) => onAddEvidence(parkRequirement.id, ev)}
        title={`Evidencia: ${requirement.title}`}
      />

      <RequirementValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        requirement={requirement}
        parkRequirement={parkRequirement}
        onSave={(status, notes) => onUpdateStatus(parkRequirement.id, status, notes)}
      />
    </div>
  );
};
