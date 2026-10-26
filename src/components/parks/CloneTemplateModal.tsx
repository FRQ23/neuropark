import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ChecklistTemplate } from '../../types';

interface CloneTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ChecklistTemplate[];
  onClone: (templateId: string, parkData: { name: string; state: string; location: string; description: string; contactPerson?: string }) => void;
}

export const CloneTemplateModal: React.FC<CloneTemplateModalProps> = ({
  isOpen,
  onClose,
  templates,
  onClone,
}) => {
  const [templateId, setTemplateId] = useState(templates[0]?.id || '');
  const [name, setName] = useState('');
  const [state, setState] = useState('Sonora');
  const [location, setLocation] = useState('Hermosillo, Sonora');
  const [description, setDescription] = useState(
    'Nuevo parque inclusivo diseñado y construido desde cero tomando como base el modelo replicable.'
  );
  const [contactPerson, setContactPerson] = useState('');

  const selectedTemplate = templates.find((t) => t.id === templateId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateId || !name.trim() || !state.trim()) {
      alert('Por favor completa el nombre y estado del nuevo parque.');
      return;
    }

    onClone(templateId, {
      name: name.trim(),
      state: state.trim(),
      location: location.trim(),
      description: description.trim(),
      contactPerson: contactPerson.trim(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Parque desde Plantilla"
      description="Replica la metodología de fases y requisitos adaptándola a la normativa de otro estado o ciudad."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        <Select
          label="Seleccionar plantilla base"
          value={templateId}
          onChange={(e) => {
            setTemplateId(e.target.value);
            const tpl = templates.find((t) => t.id === e.target.value);
            if (tpl) {
              setState(tpl.state);
            }
          }}
          options={templates.map((t) => ({
            value: t.id,
            label: `${t.name} (${t.state}) — ${t.phases.length} fases`,
          }))}
        />

        {selectedTemplate && (
          <div className="w3-panel w3-light-grey w3-border w3-padding-small w3-small w3-margin-bottom">
            <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedTemplate.name}</p>
            <p className="w3-text-grey" style={{ margin: '2px 0' }}>{selectedTemplate.description}</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>
              Incluye {selectedTemplate.phases.reduce((acc, p) => acc + p.requirements.length, 0)} requisitos
              iniciales en estado "Pendiente".
            </p>
          </div>
        )}

        <Input
          label="Nombre del Nuevo Parque"
          placeholder="Ej: Parque La Sauceda Inclusiva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-half">
            <Input
              label="Estado"
              placeholder="Ej: Sonora"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          <div className="w3-half">
            <Input
              label="Ubicación / Ciudad"
              placeholder="Ej: Hermosillo, Sonora"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <Input
          label="Responsable o enlace municipal (opcional)"
          placeholder="Ej: Lic. David Castro - DIF Municipal"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />

        <div className="w3-margin-bottom">
          <label htmlFor="clone-desc" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Descripción del proyecto de adaptación o construcción</b>
          </label>
          <textarea
            id="clone-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w3-input w3-border"
          />
        </div>

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Clonar y Crear Parque
          </Button>
        </div>
      </form>
    </Modal>
  );
};
