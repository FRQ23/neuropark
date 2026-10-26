import React, { useState, useEffect } from 'react';
import { associationApi } from '../services/api';
import { Association, AssociationScope } from '../types';
import { AssociationCard } from '../components/associations/AssociationCard';
import { AssociationFormModal } from '../components/associations/AssociationFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HeartHandshake, Plus, Search, Filter, Globe, Building2, Info } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AssociationsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [associations, setAssociations] = useState<Association[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScope, setSelectedScope] = useState<string>('all');

  // Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  const [assocToDelete, setAssocToDelete] = useState<Association | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await associationApi.getAll();
      setAssociations(data);
    } catch (err) {
      showError('Error', 'No se pudieron cargar las asociaciones.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAssociation = async (assocData: Omit<Association, 'id'>) => {
    try {
      if (editingAssociation) {
        await associationApi.update(editingAssociation.id, assocData);
        showSuccess('Asociación actualizada', `Se guardaron los cambios para ${assocData.name}.`);
      } else {
        await associationApi.create(assocData);
        showSuccess('Asociación registrada', `Se agregó ${assocData.name} al directorio.`);
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) {
      showError('Error al guardar', err.message);
    }
  };

  const handleDeleteAssociation = async () => {
    if (!assocToDelete) return;
    try {
      await associationApi.delete(assocToDelete.id);
      showSuccess('Asociación eliminada', `Se eliminó el registro de ${assocToDelete.name}.`);
      setAssocToDelete(null);
      loadData();
    } catch (err: any) {
      showError('Error al eliminar', err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando directorio de fundaciones y asociaciones afiliadas..." />;
  }

  // Filter and search
  const filteredAssociations = associations.filter((assoc) => {
    const matchesSearch =
      assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assoc.state && assoc.state.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesScope = selectedScope === 'all' || assoc.scope === selectedScope;

    return matchesSearch && matchesScope;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Red y Expansión' }, { label: 'Asociaciones y Contactos' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-calm-600" />
            <span>Directorio de Fundaciones y Asociaciones Afiliadas</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Red de aliados institucionales para asesoría técnica, validación de pictogramas y replicabilidad.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => {
              setEditingAssociation(null);
              setIsFormModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nueva Asociación
          </Button>
        )}
      </div>

      {/* Transcript contextual quote */}
      <div className="p-3.5 bg-calm-50 border border-calm-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-calm-700 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Vínculo estratégico (Reunión con cliente):</strong> En la minuta se enfatizó contar con un
          módulo de <em>"altas, bajas, cambios y edición de asociaciones o fundaciones (como las de apoyo a la inclusión)
          para que sirvan de base para replicarlo en otros estados"</em>.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, persona de contacto o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-calm-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="assoc-scope-filter" className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alcance:</span>
          </label>
          <select
            id="assoc-scope-filter"
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-700 font-medium flex-1 sm:flex-initial"
          >
            <option value="all">Todos los alcances ({associations.length})</option>
            <option value="local">Local (Ensenada)</option>
            <option value="estatal">Estatal (B.C.)</option>
            <option value="nacional">Nacional (México)</option>
            <option value="internacional">Internacional</option>
          </select>
        </div>
      </div>

      {/* Grid of Associations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredAssociations.map((assoc) => (
          <AssociationCard
            key={assoc.id}
            association={assoc}
            onEdit={(a) => {
              setEditingAssociation(a);
              setIsFormModalOpen(true);
            }}
            onDelete={(id) => {
              const item = associations.find((a) => a.id === id);
              if (item) setAssocToDelete(item);
            }}
          />
        ))}

        {filteredAssociations.length === 0 && (
          <div className="col-span-2 card-calm p-12 text-center text-slate-500 text-sm">
            No se encontraron asociaciones que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* Association Form Modal */}
      <AssociationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveAssociation}
        association={editingAssociation}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!assocToDelete}
        onClose={() => setAssocToDelete(null)}
        onConfirm={handleDeleteAssociation}
        title="¿Eliminar asociación del directorio?"
        message={`¿Estás seguro de que deseas eliminar a "${assocToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar definitivamente"
      />
    </div>
  );
};
