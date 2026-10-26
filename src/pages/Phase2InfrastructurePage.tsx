import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { infrastructureApi, parkApi, phaseApi } from '../services/api';
import {
  Area,
  NeurodivergenceCategory,
  Infrastructure,
  AreaCategoryInfrastructure,
  Park,
  Phase,
} from '../types';
import { PhaseHeader } from '../components/phases/PhaseHeader';
import { MatrixView } from '../components/infrastructure/MatrixView';
import { ListView } from '../components/infrastructure/ListView';
import { AddAreaModal } from '../components/infrastructure/AddAreaModal';
import { AddCategoryModal } from '../components/infrastructure/AddCategoryModal';
import { AddInfrastructureModal } from '../components/infrastructure/AddInfrastructureModal';
import { LinkInfrastructureModal } from '../components/infrastructure/LinkInfrastructureModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LayoutGrid,
  List,
  Plus,
  Sliders,
  Paintbrush,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Phase2InfrastructurePage: React.FC = () => {
  const { parkId = 'park-ensenada-cooper' } = useParams<{ parkId: string }>();
  const { isAdmin, currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [park, setPark] = useState<Park | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [categories, setCategories] = useState<NeurodivergenceCategory[]>([]);
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>([]);
  const [matrixItems, setMatrixItems] = useState<AreaCategoryInfrastructure[]>([]);
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddInfrastructureOpen, setIsAddInfrastructureOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [targetCell, setTargetCell] = useState<{ areaId?: string; categoryId?: string }>({});

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [parkData, allPhases, areasData, catsData, infsData, matrixData] =
        await Promise.all([
          parkApi.getById(parkId),
          phaseApi.getAll(),
          infrastructureApi.getAreas(parkId),
          infrastructureApi.getCategories(),
          infrastructureApi.getInfrastructures(),
          infrastructureApi.getMatrixData(parkId),
        ]);

      setPark(parkData || null);
      setPhase(allPhases.find((p) => p.code === 'phase-2') || null);
      setAreas(areasData);
      setCategories(catsData);
      setInfrastructures(infsData);
      setMatrixItems(matrixData);
    } catch (err) {
      console.error('Error loading Phase 2 infrastructure data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [parkId]);

  // Physical change checkbox toggle: "¿El cambio se hizo en la realidad?"
  const handleToggleCompleted = async (id: string, current: boolean) => {
    try {
      await infrastructureApi.updateMatrixItem(id, { isCompleted: !current });
      showSuccess(
        !current ? 'Cambio físico verificado' : 'Marcado como pendiente de obra',
        'Se actualizó la confirmación de adecuación en campo.'
      );
      loadData();
    } catch (err: any) {
      showError('Error al actualizar', err.message);
    }
  };

  // Validation toggle
  const handleValidateItem = async (id: string, current: boolean) => {
    try {
      if (!current) {
        await infrastructureApi.updateMatrixItem(id, {
          isValidated: true,
          validatedBy: currentUser?.name || 'Comité Técnico',
          validatedAt: new Date().toISOString(),
        });
        showSuccess('Adecuación validada oficialmente', 'El comité ha aprobado esta especificación.');
      } else {
        await infrastructureApi.updateMatrixItem(id, {
          isValidated: false,
          validatedBy: undefined,
          validatedAt: undefined,
        });
        showSuccess('Validación retirada', 'El registro volvió a estado de revisión.');
      }
      loadData();
    } catch (err: any) {
      showError('Error al validar', err.message);
    }
  };

  // Save new Area
  const handleSaveArea = async (areaData: Omit<Area, 'id'>) => {
    try {
      await infrastructureApi.createArea(areaData);
      showSuccess('Área registrada', `Se agregó ${areaData.name} al parque.`);
      loadData();
    } catch (err: any) {
      showError('Error al crear área', err.message);
    }
  };

  // Save new Category
  const handleSaveCategory = async (catData: Omit<NeurodivergenceCategory, 'id'>) => {
    try {
      await infrastructureApi.createCategory(catData);
      showSuccess('Categoría registrada', `Se agregó ${catData.name}.`);
      loadData();
    } catch (err: any) {
      showError('Error al crear categoría', err.message);
    }
  };

  // Save new Infrastructure/Equipment/Color
  const handleSaveInfrastructure = async (infData: Omit<Infrastructure, 'id'>) => {
    try {
      await infrastructureApi.createInfrastructure(infData);
      showSuccess('Elemento registrado', `Se agregó ${infData.name}.`);
      loadData();
    } catch (err: any) {
      showError('Error al crear elemento', err.message);
    }
  };

  // Link Area + Category + Infrastructure
  const handleLinkInfrastructure = async (linkData: Omit<AreaCategoryInfrastructure, 'id'>) => {
    try {
      await infrastructureApi.linkInfrastructure(linkData);
      showSuccess('Requerimiento vinculado', 'Se incorporó a la matriz del parque.');
      loadData();
    } catch (err: any) {
      showError('Error al vincular elemento', err.message);
    }
  };

  // Delete matrix item
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('¿Deseas desvincular este elemento de la matriz?')) {
      try {
        await infrastructureApi.deleteMatrixItem(id);
        showSuccess('Elemento desvinculado', 'Se retiró el requerimiento.');
        loadData();
      } catch (err: any) {
        showError('Error al eliminar', err.message);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando catálogo de infraestructura, áreas y matriz de categorías..." />;
  }

  const totalMatrixItems = matrixItems.length;
  const completedPhysical = matrixItems.filter((i) => i.isCompleted).length;
  const validatedPhysical = matrixItems.filter((i) => i.isValidated).length;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Parques', path: '/parks' },
          { label: park?.name || 'Parque Cooper', path: `/parks/${parkId}` },
          { label: 'Fase 2: Infraestructura y equipamiento' },
        ]}
      />

      <PhaseHeader
        order={2}
        name="Fase 2: Infraestructura, Equipamiento y Colores"
        description="Catálogo por ÁREA del parque y por CATEGORÍA neurodivergente: aparatos especiales, paleta cromática mate sin destellos y verificación física de que el cambio fue efectivamente realizado."
        totalRequirements={totalMatrixItems}
        completedRequirements={completedPhysical}
        validatedRequirements={validatedPhysical}
      />

      {/* Info note */}
      <div className="p-3.5 bg-calm-50 border border-calm-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-calm-700 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Validación de campo:</strong> El cliente estipuló que toda adecuación física o
          cambio de pintura debe ser validado con confirmación física (check "¿Cambio físico hecho?") y
          con dictamen de especialistas antes de autorizar la apertura.
        </p>
      </div>

      {/* Controls & Catalog Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase mr-1">Vista:</span>
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200" role="group">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] ${
                viewMode === 'matrix'
                  ? 'bg-white text-calm-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={viewMode === 'matrix'}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Matriz Cruzada (Áreas x Categorías)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] ${
                viewMode === 'list'
                  ? 'bg-white text-calm-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-4 h-4" />
              <span>Lista Detallada con Filtros</span>
            </button>
          </div>
        </div>

        {/* Admin Catalogs Management Buttons */}
        {isAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddAreaOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              + Área
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddCategoryOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              + Categoría
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddInfrastructureOpen(true)}
              leftIcon={<Paintbrush className="w-3.5 h-3.5" />}
            >
              + Equipo / Color
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setTargetCell({});
                setIsLinkModalOpen(true);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Asignar a Matriz
            </Button>
          </div>
        )}
      </div>

      {/* Render Selected View */}
      {viewMode === 'matrix' ? (
        <MatrixView
          areas={areas}
          categories={categories}
          infrastructures={infrastructures}
          matrixItems={matrixItems}
          onToggleCompleted={handleToggleCompleted}
          onValidateItem={handleValidateItem}
          onOpenLinkModal={(areaId, categoryId) => {
            setTargetCell({ areaId, categoryId });
            setIsLinkModalOpen(true);
          }}
        />
      ) : (
        <ListView
          areas={areas}
          categories={categories}
          infrastructures={infrastructures}
          matrixItems={matrixItems}
          onToggleCompleted={handleToggleCompleted}
          onValidateItem={handleValidateItem}
          onDeleteItem={handleDeleteItem}
        />
      )}

      {/* Modals for Catalogs */}
      <AddAreaModal
        isOpen={isAddAreaOpen}
        onClose={() => setIsAddAreaOpen(false)}
        onSave={handleSaveArea}
        parkId={parkId}
      />

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSave={handleSaveCategory}
      />

      <AddInfrastructureModal
        isOpen={isAddInfrastructureOpen}
        onClose={() => setIsAddInfrastructureOpen(false)}
        onSave={handleSaveInfrastructure}
      />

      <LinkInfrastructureModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleLinkInfrastructure}
        parkId={parkId}
        areas={areas}
        categories={categories}
        infrastructures={infrastructures}
        defaultAreaId={targetCell.areaId}
        defaultCategoryId={targetCell.categoryId}
      />
    </div>
  );
};
