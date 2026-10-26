import React, { useState, useEffect } from 'react';
import { parkApi, templateApi } from '../services/api';
import { Park, ChecklistTemplate } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { CloneTemplateModal } from '../components/parks/CloneTemplateModal';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ParksPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [parks, setParks] = useState<Park[]>([]);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Manual create form
  const [name, setName] = useState('');
  const [state, setState] = useState('Baja California');
  const [location, setLocation] = useState('Mexicali, B.C.');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [parksData, templatesData] = await Promise.all([
        parkApi.getAll(),
        templateApi.getAll(),
      ]);
      setParks(parksData);
      setTemplates(templatesData);
    } catch (err) {
      showError('Error', 'No se pudieron cargar los parques.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClone = async (templateId: string, parkData: any) => {
    try {
      const newPark = await parkApi.cloneFromTemplate(templateId, parkData);
      showSuccess(
        'Parque replicado desde plantilla',
        `Se creó ${newPark.name} con sus fases y requisitos iniciales.`
      );
      setIsCloneModalOpen(false);
      loadData();
    } catch (err: any) {
      showError('Error al clonar', err.message);
    }
  };

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const newPark = await parkApi.create({
        name: name.trim(),
        state: state.trim(),
        location: location.trim(),
        description: description.trim(),
        contactPerson: contactPerson.trim(),
        status: 'draft',
        assignedUserIds: ['user-admin-1'],
      });
      showSuccess('Parque registrado', `Se agregó ${newPark.name}.`);
      setIsCreateModalOpen(false);
      setName('');
      loadData();
    } catch (err: any) {
      showError('Error al crear', err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando directorio de parques..." />;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Directorio de Parques Inclusivos' }]} />

      <div className="w3-container w3-white w3-card w3-padding-24 w3-margin-bottom">
        <div className="w3-row">
          <div className="w3-col l8 m12 s12">
            <h1 className="w3-xxlarge w3-wide" style={{ margin: '4px 0' }}>
              <i className="fa fa-tree w3-margin-right"></i>
              PARQUES INCLUSIVOS
            </h1>
            <p className="w3-text-grey" style={{ margin: '4px 0 0 0', lineHeight: '1.6' }}>
              Gestión multi-parque: seguimiento paso a paso en Ensenada y replicabilidad para otros estados.
            </p>
          </div>

          {isAdmin && (
            <div className="w3-col l4 m12 s12 w3-right-align w3-margin-top">
              <Button
                variant="outline"
                onClick={() => setIsCloneModalOpen(true)}
                leftIcon={<i className="fa fa-clone"></i>}
                style={{ marginRight: '8px' }}
              >
                Clonar Plantilla
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<i className="fa fa-plus"></i>}
              >
                Nuevo Parque
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Parks */}
      <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
        {parks.map((park) => (
          <div key={park.id} className="w3-col l4 m6 s12 w3-margin-bottom">
            <div className="w3-card w3-white w3-container w3-padding-16" style={{ minHeight: '270px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="w3-tag w3-black w3-small">{park.state}</span>

                  <span
                    className={`w3-tag w3-small ${
                      park.status === 'open'
                        ? 'w3-green'
                        : park.status === 'ready_to_open'
                        ? 'w3-teal'
                        : park.status === 'in_progress'
                        ? 'w3-blue'
                        : 'w3-khaki'
                    }`}
                  >
                    {park.status === 'open'
                      ? 'Abierto al Público'
                      : park.status === 'ready_to_open'
                      ? 'Listo para Abrir'
                      : park.status === 'in_progress'
                      ? 'En Adecuación'
                      : 'Borrador'}
                  </span>
                </div>

                <h3 className="w3-large w3-wide" style={{ margin: '8px 0 4px 0' }}>{park.name}</h3>
                <p className="w3-small w3-text-grey" style={{ margin: '2px 0 8px 0' }}>
                  <i className="fa fa-map-marker w3-margin-right"></i>
                  {park.location}
                </p>

                <p className="w3-small" style={{ lineHeight: '1.5', margin: '4px 0 8px 0' }}>
                  {park.description}
                </p>

                {park.contactPerson && (
                  <p className="w3-tiny w3-text-grey" style={{ margin: '4px 0' }}>
                    Responsable: <b>{park.contactPerson}</b>
                  </p>
                )}
              </div>

              <div className="w3-border-top" style={{ paddingTop: '10px', marginTop: '12px' }}>
                <Link
                  to={`/parks/${park.id}`}
                  className="w3-button w3-black w3-block w3-small w3-wide"
                >
                  VER FASES Y COMITÉS <i className="fa fa-arrow-right w3-margin-left"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Registro de Parque"
        maxWidth="md"
      >
        <form onSubmit={handleManualCreate}>
          <Input
            label="Nombre del Parque"
            placeholder="Ej: Parque Morelos Inclusivo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
            <div className="w3-half">
              <Input
                label="Estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
            <div className="w3-half">
              <Input
                label="Ubicación / Ciudad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <Input
            label="Persona responsable / Enlace"
            placeholder="Ej: Arq. Fernando Reyes"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
          />

          <div className="w3-margin-bottom">
            <label htmlFor="park-desc-input" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
              <b>Descripción de la adaptación</b>
            </label>
            <textarea
              id="park-desc-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w3-input w3-border"
            />
          </div>

          <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)} style={{ marginRight: '8px' }}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Parque
            </Button>
          </div>
        </form>
      </Modal>

      {/* Clone From Template Modal */}
      <CloneTemplateModal
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        templates={templates}
        onClone={handleClone}
      />
    </div>
  );
};
