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
      className="w3-padding-16"
      style={{ borderBottom: '1px solid #e5e7eb' }}
    >
      {/* Top row: tags, title and status */}
      <div className="w3-row" style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ marginBottom: '6px' }}>
            <Badge status={parkRequirement.status} />
            {requirement.specialty && (
              <span style={{ marginLeft: '6px' }}>
                <Badge specialty={requirement.specialty} size="sm" />
              </span>
            )}
          </div>
          <h3 style={{ margin: '4px 0', fontSize: '18px', fontWeight: 'bold' }}>{requirement.title}</h3>
          <p className="w3-text-grey" style={{ margin: '4px 0 8px 0', lineHeight: '1.5', fontSize: '14px' }}>
            {requirement.description}
          </p>

          {/* Validation info and notes if present (flat inline) */}
          {(parkRequirement.notes || parkRequirement.validatedBy) && (
            <div className="w3-small" style={{ margin: '8px 0', paddingLeft: '12px', borderLeft: '3px solid #2e7d32' }}>
              {parkRequirement.validatedBy && (
                <span className="w3-text-green font-bold" style={{ marginRight: '8px' }}>
                  <i className="fa fa-check" style={{ marginRight: '4px' }}></i>
                  Validado por {parkRequirement.validatedByName || parkRequirement.validatedBy}
                  {parkRequirement.validatedAt && (
                    <span className="w3-text-grey" style={{ fontWeight: 'normal', marginLeft: '4px' }}>
                      ({new Date(parkRequirement.validatedAt).toLocaleDateString('es-MX')})
                    </span>
                  )}
                </span>
              )}
              {parkRequirement.notes && (
                <span className="w3-text-dark-grey" style={{ fontStyle: 'italic', display: 'inline-block', marginLeft: '4px' }}>
                  &mdash; "{parkRequirement.notes}"
                </span>
              )}
            </div>
          )}

          {/* Evidence trigger row */}
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowEvidence((prev) => !prev)}
              className="w3-button w3-light-grey w3-small"
              style={{ padding: '3px 8px' }}
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
                className="w3-button w3-white w3-border w3-small"
                style={{ padding: '3px 8px' }}
              >
                <i className="fa fa-plus w3-margin-right"></i>Adjuntar foto
              </button>
            ) : null}
          </div>
        </div>

        {/* Action button: Validate or update status */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            <>
              {onEditRequirement && (
                <button
                  type="button"
                  onClick={() => onEditRequirement(requirement)}
                  className="w3-button w3-light-grey w3-small"
                  title="Editar requisito"
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
            </>
          )}
        </div>
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
