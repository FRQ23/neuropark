import React, { useState, useEffect } from 'react';
import { templateApi, parkApi } from '../services/api';
import { ChecklistTemplate } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { CloneTemplateModal } from '../components/parks/CloneTemplateModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
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
    <div>
      <Breadcrumbs items={[{ label: 'Red y Expansión' }, { label: 'Plantillas de Replicabilidad' }]} />

      <div className="w3-padding-24" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <div className="w3-row">
          <div className="w3-col l8 m8 s12">
            <h1 className="w3-xxlarge w3-wide" style={{ margin: '4px 0', fontWeight: 'bold' }}>
              <i className="fa fa-clone w3-margin-right"></i>
              PLANTILLAS DE REPLICABILIDAD
            </h1>
            <p className="w3-text-grey" style={{ margin: '4px 0 0 0', lineHeight: '1.6' }}>
              Estandarización del modelo para adaptar parques existentes o construir nuevos desde cero en otras entidades federativas.
            </p>
          </div>

          {isAdmin && (
            <div className="w3-col l4 m4 s12 w3-right-align w3-margin-top">
              <Button
                onClick={() => {
                  if (templates.length > 0) {
                    setSelectedTemplateForClone(templates[0]);
                    setIsCloneModalOpen(true);
                  }
                }}
                leftIcon={<i className="fa fa-clone"></i>}
              >
                Clonar Plantilla
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Templates List */}
      <div>
        {templates.map((tpl) => {
          const totalRequirements = tpl.phases.reduce((acc, p) => acc + p.requirements.length, 0);

          return (
            <div
              key={tpl.id}
              className="w3-border w3-white w3-container w3-padding-24 w3-margin-bottom"
              style={{ borderColor: '#e5e7eb' }}
            >
              <div className="w3-row">
                <div className="w3-col l8 m8 s12">
                  <div style={{ marginBottom: '6px' }}>
                    <span className="w3-tag w3-black w3-small" style={{ marginRight: '6px' }}>
                      ESTADO: {tpl.state.toUpperCase()}
                    </span>
                    <span className="w3-small w3-text-grey">
                      {tpl.phases.length} Fases • {totalRequirements} Requisitos incluidos
                    </span>
                  </div>

                  <h2 className="w3-large w3-wide" style={{ margin: '6px 0' }}>{tpl.name}</h2>
                  <p className="w3-text-grey" style={{ lineHeight: '1.6', margin: '4px 0 16px 0' }}>
                    {tpl.description}
                  </p>
                </div>

                {isAdmin && (
                  <div className="w3-col l4 m4 s12 w3-right-align">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedTemplateForClone(tpl);
                        setIsCloneModalOpen(true);
                      }}
                      leftIcon={<i className="fa fa-clone"></i>}
                    >
                      Usar esta Plantilla
                    </Button>
                  </div>
                )}
              </div>

              {/* Phases and Requirements Breakdown inside this template */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <p className="w3-small w3-text-grey font-bold w3-wide" style={{ margin: '0 0 12px 0' }}>
                  FASES Y ESTRUCTURA DE REQUISITOS PRECARGADOS:
                </p>

                <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
                  {tpl.phases.map((phase) => (
                    <div key={phase.order} className="w3-col l4 m12 s12 w3-margin-bottom">
                      <div className="w3-panel w3-light-grey w3-border w3-padding-small">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span className="w3-tag w3-black w3-small">
                            {phase.order}
                          </span>
                          <b>{phase.name}</b>
                        </div>

                        <ul className="w3-ul w3-tiny w3-text-dark-grey" style={{ padding: 0 }}>
                          {phase.requirements.map((req, rIdx) => (
                            <li key={rIdx} style={{ padding: '4px 0', borderBottom: '1px dotted #ccc' }}>
                              • {req.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clone Modal */}
      {selectedTemplateForClone && (
        <CloneTemplateModal
          isOpen={isCloneModalOpen}
          onClose={() => setIsCloneModalOpen(false)}
          templates={templates}
          onClone={handleClone}
        />
      )}
    </div>
  );
};
