import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requirementApi, parkApi } from '../services/api';
import { Requirement, ParkRequirement, RequirementStatus, Park } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PhaseHeader } from '../components/phases/PhaseHeader';
import { RequirementItem } from '../components/phases/RequirementItem';
import { RequirementFormModal } from '../components/phases/RequirementFormModal';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Phase3SignagePage: React.FC = () => {
  const { parkId = 'park-ensenada-cooper' } = useParams<{ parkId: string }>();
  const { currentUser, isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [park, setPark] = useState<Park | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [parkRequirements, setParkRequirements] = useState<ParkRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [parkData, allReqs, parkReqs] = await Promise.all([
        parkApi.getById(parkId),
        requirementApi.getByPhase('phase-3'),
        requirementApi.getParkRequirements(parkId),
      ]);
      setPark(parkData || null);
      setRequirements(allReqs);
      setParkRequirements(parkReqs);
    } catch (err) {
      console.error('Error loading Phase 3 data', err);
      showError('Error', 'No se pudieron cargar los requisitos de señalética.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [parkId]);

  const handleUpdateStatus = async (
    parkReqId: string,
    newStatus: RequirementStatus,
    notes?: string
  ) => {
    try {
      const updated = await requirementApi.updateParkRequirementStatus(
        parkReqId,
        newStatus,
        notes,
        currentUser || undefined
      );
      setParkRequirements((prev) =>
        prev.map((pr) => (pr.id === updated.id ? updated : pr))
      );
      showSuccess(
        'Dictamen actualizado',
        `El requisito de señalética ahora tiene estatus: ${newStatus.toUpperCase()}`
      );
    } catch (err: any) {
      showError('Error al dictaminar', err.message);
    }
  };

  const handleAddEvidence = async (
    parkReqId: string,
    evidence: { type: 'before' | 'after'; url: string; caption: string; uploadedBy: string }
  ) => {
    try {
      const updated = await requirementApi.addEvidence(parkReqId, evidence);
      setParkRequirements((prev) =>
        prev.map((pr) => (pr.id === updated.id ? updated : pr))
      );
      showSuccess('Evidencia fotográfica añadida', 'La foto se guardó correctamente.');
    } catch (err: any) {
      showError('Error al subir evidencia', err.message);
    }
  };

  const handleDeleteEvidence = async (parkReqId: string, evidenceId: string) => {
    try {
      const updated = await requirementApi.deleteEvidence(parkReqId, evidenceId);
      setParkRequirements((prev) =>
        prev.map((pr) => (pr.id === updated.id ? updated : pr))
      );
      showSuccess('Evidencia eliminada', 'La foto fue eliminada.');
    } catch (err: any) {
      showError('Error al eliminar evidencia', err.message);
    }
  };

  const handleSaveRequirement = async (reqData: Partial<Requirement>) => {
    try {
      if (editingRequirement) {
        const updated = await requirementApi.update(editingRequirement.id, reqData);
        setRequirements((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        showSuccess('Requisito modificado', 'Los cambios se guardaron.');
      } else {
        const created = await requirementApi.create({
          ...reqData,
          phaseCode: 'phase-3',
          code: `F3-CUSTOM-${Date.now().toString().slice(-4)}`,
        } as any);
        setRequirements((prev) => [...prev, created]);
        await requirementApi.updateParkRequirementStatus(
          `temp-${created.id}`,
          'pending'
        );
        showSuccess('Nuevo requisito registrado', created.title);
      }
      setIsFormModalOpen(false);
      setEditingRequirement(null);
      loadData();
    } catch (err: any) {
      showError('Error al guardar requisito', err.message);
    }
  };

  const handleDeleteRequirement = async (reqId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este requerimiento de señalética?')) return;
    try {
      await requirementApi.delete(reqId);
      setRequirements((prev) => prev.filter((r) => r.id !== reqId));
      showSuccess('Requisito eliminado', 'Se quitó del catálogo.');
    } catch (err: any) {
      showError('Error al eliminar', err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando señalética y acuerdos de la Fase 3..." />;
  }

  const total = requirements.length;
  const validated = parkRequirements.filter(
    (pr) => requirements.some((r) => r.id === pr.requirementId) && pr.status === 'validated'
  ).length;
  const completed = parkRequirements.filter(
    (pr) => requirements.some((r) => r.id === pr.requirementId) && pr.status === 'completed'
  ).length;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Parques', path: '/parks' },
          { label: park?.name || 'Parque Cooper', path: `/parks/${parkId}` },
          { label: 'Fase 3: Señalética e inclusión' },
        ]}
      />

      <PhaseHeader
        order={3}
        name="Fase 3: Señalética Inclusiva y Acuerdos Comunitarios"
        description="Letreros con pictogramas accesibles, mapa háptico táctil en acceso principal y señalética especial de emergencia para neurodivergencias consensuada con la comunidad."
        totalRequirements={total}
        completedRequirements={completed}
        validatedRequirements={validated}
      />

      {/* Action Bar (flat) */}
      <div className="w3-padding-16" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '12px' }}>
        <div className="w3-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="w3-medium w3-wide" style={{ margin: 0 }}>CHECKLIST DE SEÑALÉTICA</h3>
            <p className="w3-small w3-text-grey" style={{ margin: '2px 0 0 0' }}>
              Verifica el diseño con pictogramas y la instalación física de cada letrero en el parque
            </p>
          </div>

          {isAdmin && (
            <div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingRequirement(null);
                  setIsFormModalOpen(true);
                }}
                leftIcon={<i className="fa fa-plus"></i>}
              >
                Nuevo Requerimiento
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* List of Requirements */}
      <div>
        {requirements.map((req) => {
          const parkReq = parkRequirements.find((pr) => pr.requirementId === req.id) || {
            id: `temp-${req.id}`,
            parkId,
            requirementId: req.id,
            status: 'pending' as RequirementStatus,
            evidence: [],
          };

          return (
            <RequirementItem
              key={req.id}
              requirement={req}
              parkRequirement={parkReq}
              onUpdateStatus={handleUpdateStatus}
              onAddEvidence={handleAddEvidence}
              onDeleteEvidence={handleDeleteEvidence}
              onEditRequirement={(r) => {
                setEditingRequirement(r);
                setIsFormModalOpen(true);
              }}
              onDeleteRequirement={handleDeleteRequirement}
            />
          );
        })}
      </div>

      {/* Requirement Form Modal (Admin) */}
      <RequirementFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveRequirement}
        requirement={editingRequirement}
        phaseCode="phase-3"
      />
    </div>
  );
};
