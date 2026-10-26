import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requirementApi, parkApi } from '../services/api';
import { Requirement, ParkRequirement, RequirementStatus, CommitteeSpecialty, Park } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PhaseHeader } from '../components/phases/PhaseHeader';
import { RequirementItem } from '../components/phases/RequirementItem';
import { RequirementFormModal } from '../components/phases/RequirementFormModal';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Phase1PermitsPage: React.FC = () => {
  const { parkId = 'park-ensenada-cooper' } = useParams<{ parkId: string }>();
  const { currentUser, isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [park, setPark] = useState<Park | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [parkRequirements, setParkRequirements] = useState<ParkRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [parkData, allReqs, parkReqs] = await Promise.all([
        parkApi.getById(parkId),
        requirementApi.getByPhase('phase-1'),
        requirementApi.getParkRequirements(parkId),
      ]);
      setPark(parkData || null);
      setRequirements(allReqs);
      setParkRequirements(parkReqs);
    } catch (err) {
      console.error('Error loading phase 1 data', err);
      showError('Error', 'No se pudieron cargar los requisitos de la Fase 1.');
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
        `El requisito ahora tiene estatus: ${newStatus.toUpperCase()}`
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
          phaseCode: 'phase-1',
          code: `F1-CUSTOM-${Date.now().toString().slice(-4)}`,
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
    if (!window.confirm('¿Seguro que deseas eliminar este requisito del catálogo?')) return;
    try {
      await requirementApi.delete(reqId);
      setRequirements((prev) => prev.filter((r) => r.id !== reqId));
      showSuccess('Requisito eliminado', 'Se quitó del catálogo oficial.');
    } catch (err: any) {
      showError('Error al eliminar', err.message);
    }
  };

  // Filtered requirements
  const filteredRequirements = requirements.filter((req) => {
    const parkReq = parkRequirements.find((pr) => pr.requirementId === req.id);
    const status = parkReq ? parkReq.status : 'pending';

    const matchesSpecialty =
      selectedSpecialty === 'all' || req.specialty === selectedSpecialty;
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

    return matchesSpecialty && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando lineamientos y permisos de la Fase 1..." />;
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
          { label: 'Fase 1: Lineamientos y permisos' },
        ]}
      />

      <PhaseHeader
        order={1}
        name="Fase 1: Lineamientos y permisos de gobierno"
        description="Checklist exhaustivo de documentación legal, licencias de uso de suelo, dictámenes de protección civil y viabilidad presupuestaria con el Ayuntamiento y Gobierno Estatal."
        totalRequirements={total}
        completedRequirements={completed}
        validatedRequirements={validated}
      />

      {/* Info note about client seed data rules */}
      <div className="w3-panel w3-light-grey w3-border w3-padding-16 w3-small w3-margin-bottom">
        <p style={{ margin: 0 }}>
          <i className="fa fa-info-circle w3-margin-right w3-large"></i>
          <b>Regla de requerimientos:</b> Los requisitos que llevan el distintivo de{' '}
          <span className="w3-tag w3-khaki w3-small">Placeholder de ejemplo</span>{' '}
          pueden ser modificados o ampliados por el Administrador con la redacción y leyes reales de cada municipio.
        </p>
      </div>

      {/* Filters and Actions Bar */}
      <div className="w3-container w3-white w3-card w3-padding-16 w3-margin-bottom">
        <div className="w3-row">
          <div className="w3-col l8 m8 s12" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="w3-small font-bold">
              <i className="fa fa-filter w3-margin-right"></i>FILTROS:
            </span>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w3-select w3-border w3-small"
              style={{ width: 'auto', display: 'inline-block' }}
              aria-label="Filtrar por especialidad"
            >
              <option value="all">Todas las especialidades</option>
              <option value="general">General / Gobierno</option>
              <option value="education">Educación</option>
              <option value="psychology">Psicología</option>
              <option value="finance">Finanzas</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w3-select w3-border w3-small"
              style={{ width: 'auto', display: 'inline-block' }}
              aria-label="Filtrar por estatus"
            >
              <option value="all">Todos los estatus</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completado</option>
              <option value="validated">Validado</option>
            </select>
          </div>

          {isAdmin && (
            <div className="w3-col l4 m4 s12 w3-right-align">
              <Button
                size="sm"
                onClick={() => {
                  setEditingRequirement(null);
                  setIsFormModalOpen(true);
                }}
                leftIcon={<i className="fa fa-plus"></i>}
              >
                Nuevo Requisito
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Requirements List */}
      <div className="w3-margin-bottom">
        {filteredRequirements.map((req) => {
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

        {filteredRequirements.length === 0 && (
          <div className="w3-container w3-white w3-card w3-padding-32 w3-center w3-text-grey">
            No se encontraron requisitos que coincidan con los filtros aplicados.
          </div>
        )}
      </div>

      {/* Requirement Form Modal (Admin) */}
      <RequirementFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveRequirement}
        requirement={editingRequirement}
        phaseCode="phase-1"
      />
    </div>
  );
};
