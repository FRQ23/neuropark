import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requirementApi, parkApi, phaseApi } from '../services/api';
import { Requirement, ParkRequirement, RequirementStatus, Park, Phase } from '../types';
import { PhaseHeader } from '../components/phases/PhaseHeader';
import { RequirementItem } from '../components/phases/RequirementItem';
import { RequirementFormModal } from '../components/phases/RequirementFormModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Signpost, AlertOctagon, HeartHandshake, Info } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Phase3SignagePage: React.FC = () => {
  const { parkId = 'park-ensenada-cooper' } = useParams<{ parkId: string }>();
  const { isAdmin, currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [park, setPark] = useState<Park | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [parkRequirements, setParkRequirements] = useState<ParkRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [parkData, allPhases, allReqs, parkReqs] = await Promise.all([
        parkApi.getById(parkId),
        phaseApi.getAll(),
        requirementApi.getByPhase('phase-3'),
        requirementApi.getParkRequirements(parkId),
      ]);

      setPark(parkData || null);
      setPhase(allPhases.find((p) => p.code === 'phase-3') || null);
      setRequirements(allReqs);
      setParkRequirements(parkReqs);
    } catch (err) {
      console.error('Error loading Phase 3 data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [parkId]);

  // Update status & dictamen
  const handleUpdateStatus = async (parkReqId: string, status: RequirementStatus, notes?: string) => {
    try {
      await requirementApi.updateParkRequirementStatus(parkReqId, status, notes, currentUser || undefined);
      showSuccess('Dictamen registrado', 'Se guardó la validación del requerimiento de señalética.');
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
      showSuccess('Evidencia fotográfica adjuntada', 'Se guardó la foto del letrero o pictograma.');
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
        showSuccess('Requisito actualizado', 'Se actualizaron los datos.');
      } else {
        await requirementApi.create(data as any);
        showSuccess('Requisito creado', 'Se agregó el nuevo requerimiento de señalética.');
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) {
      showError('Error al guardar', err.message);
    }
  };

  const handleDeleteRequirement = async (id: string) => {
    if (window.confirm('¿Deseas eliminar este requerimiento de señalética?')) {
      try {
        await requirementApi.delete(id);
        showSuccess('Requisito eliminado', 'Se retiró el requerimiento.');
        loadData();
      } catch (err: any) {
        showError('Error al eliminar', err.message);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando señalética inclusiva y acuerdos con la comunidad..." />;
  }

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
          { label: 'Fase 3: Señalética y comunidad' },
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

      {/* Emergency Signage Highlight Box from client transcript */}
      <div className="card-calm p-5 border-l-4 border-l-amber-500 bg-amber-50/40 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900 flex-shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-800">
              Módulo Clave: Señalética de Emergencia para Neurodivergencias
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conforme al diálogo con el cliente, las personas neurodivergentes requieren señalización
              distintiva que no cause alarma auditiva agresiva (sin sirenas estridentes) y que indique
              rutas inmediatas hacia la <strong>Zona de Calma y Descompresión Sensorial</strong> ante una crisis de sobrecarga.
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Checklist de Señalética</h2>
          <p className="text-xs text-slate-500">
            Verifica el diseño con pictogramas y la instalación física de cada letrero en el parque
          </p>
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
            Nuevo Requerimiento de Señalética
          </Button>
        )}
      </div>

      {/* List of Requirements */}
      <div className="space-y-4">
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
