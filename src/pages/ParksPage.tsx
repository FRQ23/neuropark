import React, { useState, useEffect } from 'react';
import { parkApi, templateApi } from '../services/api';
import { Park, ChecklistTemplate } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { CloneTemplateModal } from '../components/parks/CloneTemplateModal';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Link } from 'react-router-dom';
import { Trees, Plus, Copy, MapPin, ArrowRight, UserCheck, Calendar } from 'lucide-react';
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
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Directorio de Parques Inclusivos' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trees className="w-6 h-6 text-calm-600" />
            <span>Parques Inclusivos en Proceso de Adecuación</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestión multi-parque: seguimiento paso a paso en Ensenada y replicabilidad para otros estados.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setIsCloneModalOpen(true)}
              leftIcon={<Copy className="w-4 h-4" />}
            >
              Clonar desde Plantilla
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nuevo Parque
            </Button>
          </div>
        )}
      </div>

      {/* Grid of Parks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parks.map((park) => (
          <article
            key={park.id}
            aria-label={`Parque: ${park.name}`}
            className="card-calm p-6 flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-calm-800 bg-calm-50 border border-calm-200 px-2 py-0.5 rounded">
                  {park.state}
                </span>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    park.status === 'open'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : park.status === 'ready_to_open'
                      ? 'bg-teal-100 text-teal-900 border border-teal-300'
                      : park.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
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

              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-snug">{park.name}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-calm-600 flex-shrink-0" />
                  <span>{park.location}</span>
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {park.description}
              </p>

              {park.contactPerson && (
                <p className="text-xs text-slate-500 pt-1">
                  Responsable: <strong className="text-slate-700">{park.contactPerson}</strong>
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/parks/${park.id}`}
                className="text-xs font-semibold text-calm-700 hover:text-calm-900 inline-flex items-center gap-1.5"
              >
                <span>Ver fases y comités</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={`/parks/${park.id}/phase-1`}
                className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
              >
                Ir a Fase 1
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Manual Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Registro de Parque"
        maxWidth="md"
      >
        <form onSubmit={handleManualCreate} className="space-y-4">
          <Input
            label="Nombre del Parque"
            placeholder="Ej: Parque Morelos Inclusivo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estado"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <Input
              label="Ubicación / Ciudad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <Input
            label="Persona responsable / Enlace"
            placeholder="Ej: Arq. Fernando Reyes"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
          />

          <div className="space-y-1.5">
            <label htmlFor="park-desc-input" className="block text-sm font-medium text-slate-700">
              Descripción de la adaptación
            </label>
            <textarea
              id="park-desc-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
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
