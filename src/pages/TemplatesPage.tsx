import React, { useState, useEffect } from 'react';
import { templateApi, parkApi } from '../services/api';
import { ChecklistTemplate } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CloneTemplateModal } from '../components/parks/CloneTemplateModal';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Layers, Copy, Plus, MapPin, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TemplatesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplateForClone, setSelectedTemplateForClone] = useState<ChecklistTemplate | null>(null);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await templateApi.getAll();
      setTemplates(data);
    } catch (err) {
      showError('Error', 'No se pudieron cargar las plantillas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleClone = async (templateId: string, parkData: any) => {
    try {
      const newPark = await parkApi.cloneFromTemplate(templateId, parkData);
      showSuccess(
        'Parque creado con éxito',
        `Se inicializó el parque ${newPark.name} con las fases de la plantilla.`
      );
      setIsCloneModalOpen(false);
      navigate(`/parks/${newPark.id}`);
    } catch (err: any) {
      showError('Error al clonar plantilla', err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando plantillas de replicabilidad estatal..." />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Red y Expansión' }, { label: 'Plantillas de Replicabilidad' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-6 h-6 text-calm-600" />
            <span>Plantillas de Replicabilidad por Estado</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Estandarización del modelo para adaptar parques existentes o construir nuevos desde cero en otras entidades federativas.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => {
              if (templates.length > 0) {
                setSelectedTemplateForClone(templates[0]);
                setIsCloneModalOpen(true);
              }
            }}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            Clonar Plantilla a Nuevo Parque
          </Button>
        )}
      </div>

      {/* Transcript note about Sonora / Hermosillo & Baja California */}
      <div className="p-3.5 bg-calm-50 border border-calm-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-calm-700 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Contexto de Replicabilidad (Minuta de reunión):</strong> <em>"El primero en el estado que se
          va a abrir es Ensenada (parque preexistente adaptado), pero el primero desde cero va a estar en
          Hermosillo, Sonora. Al ser otro estado cambian los permisos y regulaciones."</em> Las plantillas permiten
          precargar los requisitos según la legislación estatal aplicable.
        </p>
      </div>

      {/* Templates List */}
      <div className="space-y-6">
        {templates.map((tpl) => {
          const totalRequirements = tpl.phases.reduce((acc, p) => acc + p.requirements.length, 0);

          return (
            <article
              key={tpl.id}
              aria-label={`Plantilla: ${tpl.name}`}
              className="card-calm p-6 space-y-5 border-l-4 border-l-calm-600"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-calm-900 bg-calm-100 border border-calm-200 px-2 py-0.5 rounded">
                      Estado: {tpl.state}
                    </span>
                    <span className="text-xs text-slate-500">
                      {tpl.phases.length} Fases • {totalRequirements} Requisitos incluidos
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-800">{tpl.name}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {tpl.description}
                  </p>
                </div>

                {isAdmin && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedTemplateForClone(tpl);
                      setIsCloneModalOpen(true);
                    }}
                    leftIcon={<Copy className="w-4 h-4" />}
                    className="flex-shrink-0"
                  >
                    Usar esta Plantilla
                  </Button>
                )}
              </div>

              {/* Phases and Requirements Breakdown inside this template */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Fases y estructura de requisitos precargados:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {tpl.phases.map((phase) => (
                    <div
                      key={phase.order}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-calm-600 text-white flex items-center justify-center text-[10px]">
                          {phase.order}
                        </span>
                        <span className="truncate">{phase.name}</span>
                      </div>

                      <ul className="space-y-1 text-slate-600">
                        {phase.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                            <span className="text-calm-600">•</span>
                            <span className="line-clamp-2">{req.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Clone Modal */}
      <CloneTemplateModal
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        templates={templates}
        onClone={handleClone}
      />
    </div>
  );
};
