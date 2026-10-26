import React, { useState } from 'react';
import { Requirement, ParkRequirement, RequirementStatus, EvidenceItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EvidenceGallery } from './EvidenceGallery';
import { EvidenceUploadModal } from './EvidenceUploadModal';
import { RequirementValidationModal } from './RequirementValidationModal';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  Clock,
  Camera,
  MessageSquare,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
} from 'lucide-react';

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

  // Status indicator border color
  const statusBorderClass = {
    pending: 'border-l-amber-400',
    in_progress: 'border-l-blue-400',
    completed: 'border-l-teal-500',
    validated: 'border-l-emerald-600',
  }[parkRequirement.status];

  return (
    <article
      aria-label={`Requisito: ${requirement.title}`}
      className={`card-calm border-l-4 ${statusBorderClass} p-5 space-y-4 transition-all`}
    >
      {/* Top row: tags, title and status */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge status={parkRequirement.status} />
            {requirement.specialty && (
              <Badge specialty={requirement.specialty} size="sm" />
            )}
            {requirement.isExample && (
              <span className="text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                Placeholder de ejemplo
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-800 leading-snug">
            {requirement.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {requirement.description}
          </p>
        </div>

        {/* Action button: Validate or update status */}
        <div className="flex items-center gap-2 self-start flex-wrap">
          <Button
            size="sm"
            variant={parkRequirement.status === 'validated' ? 'outline' : 'primary'}
            onClick={() => setIsValidationModalOpen(true)}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
            title={
              hasSpecialtyPermission
                ? 'Validar o dictaminar requisito'
                : 'Ver detalles de validación (restringido a su especialidad)'
            }
          >
            {parkRequirement.status === 'validated' ? 'Ver Dictamen' : 'Validar / Dictaminar'}
          </Button>

          {isAdmin && (
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              {onEditRequirement && (
                <button
                  type="button"
                  onClick={() => onEditRequirement(requirement)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                  title="Editar requisito"
                  aria-label="Editar requisito"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDeleteRequirement && (
                <button
                  type="button"
                  onClick={() => onDeleteRequirement(requirement.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Eliminar requisito"
                  aria-label="Eliminar requisito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Validation info and notes if present */}
      {(parkRequirement.notes || parkRequirement.validatedBy) && (
        <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200/80">
          {parkRequirement.validatedBy && (
            <p className="text-emerald-900 font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Validado oficialmente por{' '}
              <span className="font-semibold">{parkRequirement.validatedByName || parkRequirement.validatedBy}</span>
              {parkRequirement.validatedAt && (
                <span className="text-slate-500 font-normal">
                  ({new Date(parkRequirement.validatedAt).toLocaleDateString('es-MX')})
                </span>
              )}
            </p>
          )}
          {parkRequirement.notes && (
            <div className="flex items-start gap-1.5 text-slate-700">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="italic">"{parkRequirement.notes}"</p>
            </div>
          )}
        </div>
      )}

      {/* Evidence trigger bar */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setShowEvidence((prev) => !prev)}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-expanded={showEvidence}
        >
          <Camera className="w-3.5 h-3.5 text-calm-600" aria-hidden="true" />
          <span>Evidencia fotográfica ({evidenceCount})</span>
          {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {!currentUser?.role || currentUser.role !== 'viewer' ? (
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="text-calm-700 hover:text-calm-900 font-medium hover:underline flex items-center gap-1"
          >
            <span>+ Adjuntar foto Antes/Después</span>
          </button>
        ) : null}
      </div>

      {/* Expandable Evidence Gallery */}
      {showEvidence && (
        <div className="pt-2">
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
    </article>
  );
};
