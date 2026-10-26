import React, { useState, useEffect } from 'react';
import { associationApi } from '../services/api';
import { Association } from '../types';
import { AssociationCard } from '../components/associations/AssociationCard';
import { AssociationFormModal } from '../components/associations/AssociationFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AssociationsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [associations, setAssociations] = useState<Association[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScope, setSelectedScope] = useState<string>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  const [assocToDelete, setAssocToDelete] = useState<Association | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await associationApi.getAll();
      setAssociations(data);
    } catch (err) {
      console.error('Error loading associations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (assocData: Omit<Association, 'id'>) => {
    try {
      if (editingAssociation) {
        await associationApi.update(editingAssociation.id, assocData);
        showSuccess('Asociación actualizada', `Se guardaron los datos de ${assocData.name}.`);
      } else {
        await associationApi.create(assocData);
        showSuccess('Asociación vinculada', `Se registró ${assocData.name}.`);
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) {
      showError('Error al guardar', err.message);
    }
  };

  const handleDelete = async () => {
    if (!assocToDelete) return;
    try {
      await associationApi.delete(assocToDelete.id);
      showSuccess('Asociación eliminada', `Se retiró el registro de ${assocToDelete.name}.`);
      setAssocToDelete(null);
      loadData();
    } catch (err: any) {
      showError('Error al eliminar', err.message);
    }
  };

  const filteredAssociations = associations.filter((assoc) => {
    const matchesSearch =
      assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assoc.state && assoc.state.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesScope = selectedScope === 'all' || assoc.scope === selectedScope;

    return matchesSearch && matchesScope;
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando catálogo de asociaciones y fundaciones aliadas..." />;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Asociaciones y Fundaciones Aliadas' }]} />

      <div className="w3-padding-24" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <div className="w3-row">
          <div className="w3-col l8 m8 s12">
            <h1 className="w3-xxlarge w3-wide" style={{ margin: '4px 0', fontWeight: 'bold' }}>
              <i className="fa fa-handshake-o w3-margin-right"></i>
              ASOCIACIONES Y FUNDACIONES
            </h1>
            <p className="w3-text-grey" style={{ margin: '4px 0 0 0', lineHeight: '1.6' }}>
              Red de apoyo y asesoría técnica para el diseño, adaptación y validación continua en Ensenada y otros estados.
            </p>
          </div>

          {isAdmin && (
            <div className="w3-col l4 m4 s12 w3-right-align w3-margin-top">
              <Button
                variant="primary"
                onClick={() => {
                  setEditingAssociation(null);
                  setIsFormModalOpen(true);
                }}
                leftIcon={<i className="fa fa-plus"></i>}
              >
                Nueva Asociación
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters Bar (flat) */}
      <div className="w3-padding-16" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-col l8 m7 s12 w3-margin-bottom">
            <input
              type="text"
              placeholder="Buscar por nombre, persona de contacto o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w3-input w3-border w3-white w3-small"
            />
          </div>

          <div className="w3-col l4 m5 s12 w3-margin-bottom">
            <select
              id="assoc-scope-filter"
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w3-select w3-border w3-white w3-small"
            >
              <option value="all">Todos los alcances ({associations.length})</option>
              <option value="local">Local (Ensenada)</option>
              <option value="estatal">Estatal (B.C.)</option>
              <option value="nacional">Nacional (México)</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Associations */}
      <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
        {filteredAssociations.map((assoc) => (
          <div key={assoc.id} className="w3-col l6 m12 s12">
            <AssociationCard
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
          </div>
        ))}

        {filteredAssociations.length === 0 && (
          <div className="w3-col s12">
            <div className="w3-container w3-white w3-border w3-padding-32 w3-center w3-text-grey" style={{ borderColor: '#e5e7eb' }}>
              No se encontraron asociaciones con los filtros de búsqueda aplicados.
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AssociationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        association={editingAssociation}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!assocToDelete}
        onClose={() => setAssocToDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar Asociación"
        message={`¿Seguro que deseas eliminar el registro de ${assocToDelete?.name}?`}
        confirmLabel="Eliminar Registro"
      />
    </div>
  );
};
