import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requirementApi, parkApi, phaseApi } from '../services/api';
import { Requirement, ParkRequirement, RequirementStatus, Park, Phase } from '../types';
import { PhaseHeader } from '../components/phases/PhaseHeader';
import { PhaseNavTabs } from '../components/phases/PhaseNavTabs';
import { RequirementItem } from '../components/phases/RequirementItem';
import { RequirementFormModal } from '../components/phases/RequirementFormModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Filter, FileCheck2, Info } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Phase1PermitsPage: React.FC = () => {
  const { parkId = 'park-ensenada-cooper' } = useParams<{ parkId: string }>();
  const { isAdmin, currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [park, setPark] = useState<Park | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
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
      const [parkData, allPhases, allReqs, parkReqs] = await Promise.all([
        parkApi.getById(parkId),
        phaseApi.getAll(),
        requirementApi.getByPhase('phase-1'),
        requirementApi.getParkRequirements(parkId),
      ]);

      setPark(parkData || null);
      const currentPhase = allPhases.find((p) => p.code === 'phase-1') || allPhases[0];
      setPhase(currentPhase || null);
      setRequirements(allReqs);
      setParkRequirements(parkReqs);
    } catch (err) {
      console.error('Error loading Phase 1 data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [parkId]);

  // Status update
  const handleUpdateStatus = async (parkReqId: string, status: RequirementStatus, notes?: string) => {
    try {
      await requirementApi.updateParkRequirementStatus(parkReqId, status, notes, currentUser || undefined);
      showSuccess('Dictamen guardado', 'El estatus del requisito ha sido actualizado.');
      loadData();
    } catch (err: any) {
      showError('Error al actualizar', err.message);
    }
  };

  // Evidence handlers
  const handleAddEvidence = async (
    parkReqId: string,
    evidence: { type: 'before' | 'after'; url: string; caption: string; uploadedBy: string }
  ) => {
    try {
      await requirementApi.addEvidence(parkReqId, evidence);
      showSuccess('Evidencia fotográfica guardada', 'La imagen se asoció exitosamente al requisito.');
      loadData();
    } catch (err: any) {
      showError('Error al guardar evidencia', err.message);
    }
  };

  const handleDeleteEvidence = async (parkReqId: string, evidenceId: string) => {
    try {
      await requirementApi.deleteEvidence(parkReqId, evidenceId);
      showSuccess('Evidencia eliminada', 'Se retiró la fotografía.');
      loadData();
    } catch (err: any) {
      showError('Error al eliminar evidencia', err.message);
    }
  };

  // Requirement CRUD
  const handleSaveRequirement = async (data: Partial<Requirement>) => {
    try {
      if (editingRequirement) {
        await requirementApi.update(editingRequirement.id, data);
        showSuccess('Requisito actualizado', 'Los cambios han sido guardados.');
      } else {
        await requirementApi.create(data as any);
        showSuccess('Requisito agregado', 'Se incorporó un nuevo requisito a la Fase 1.');
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) {
      showError('Error al guardar', err.message);
    }
  };

  const handleDeleteRequirement = async (id: string) => {
    if (window.confirm('¿Deseas eliminar este requisito de la lista?')) {
      try {
        await requirementApi.delete(id);
        showSuccess('Requisito eliminado', 'Se retiró el requisito del sistema.');
        loadData();
      } catch (err: any) {
        showError('Error al eliminar', err.message);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando lineamientos y permisos gubernamentales..." />;
  }

  // Filtered requirements
  const filteredRequirements = requirements.filter((req) => {
    if (selectedSpecialty !== 'all' && req.specialty !== selectedSpecialty) return false;
    const parkReq = parkRequirements.find((pr) => pr.requirementId === req.id);
    if (selectedStatus !== 'all' && parkReq?.status !== selectedStatus) return false;
    return true;
  });

  const total = requirements.length;
  const validated = parkRequirements.filter(
    (pr) => requirements.some((r) => r.id === pr.requirementId) && pr.status === 'validated'
  ).length;
  const completed = parkRequirements.filter(
    (pr) => requirements.some((r) => r.id === pr.requirementId) && pr.status === 'completed'
  ).length;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Parques', path: '/parks' },
          { label: park?.name || 'Parque Cooper', path: `/parks/${parkId}` },
          { label: 'Fase 1: Lineamientos y permisos' },
        ]}
      />

      <PhaseNavTabs parkId={parkId} />

      <PhaseHeader
        order={1}
        name="Fase 1: Lineamientos y permisos de gobierno"
        description="Checklist exhaustivo de documentación legal, licencias de uso de suelo, dictámenes de protección civil y viabilidad presupuestaria con el Ayuntamiento y Gobierno Estatal."
        totalRequirements={total}
        completedRequirements={completed}
        validatedRequirements={validated}
      />

      {/* Info note about client seed data rules */}
      <div className="p-3.5 bg-calm-50 border border-calm-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-calm-700 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Regla de requerimientos:</strong> Los requisitos que llevan el distintivo de{' '}
          <span className="font-semibold text-amber-900 bg-amber-100 px-1 py-0.5 rounded">
            Placeholder de ejemplo
          </span>{' '}
          pueden ser modificados o ampliados por el Administrador con la redacción y leyes reales de cada
          municipio.
        </p>
      </div>

      {/* Filters and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
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
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
            aria-label="Filtrar por estatus"
          >
            <option value="all">Todos los estatus</option>
            <option value="pending">⏳ Pendiente</option>
            <option value="in_progress">🛠️ En progreso</option>
            <option value="completed">📋 Completado</option>
            <option value="validated">✅ Validado</option>
          </select>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            onClick={() => {
              setEditingRequirement(null);
              setIsFormModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo Requisito
          </Button>
        )}
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
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
          <div className="card-calm p-12 text-center text-slate-500 text-sm">
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
