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
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="p-3 bg-calm-50 border border-calm-200 rounded-xl text-xs space-y-1">
            <p className="font-semibold text-calm-900">{selectedTemplate.name}</p>
            <p className="text-slate-600">{selectedTemplate.description}</p>
            <p className="text-calm-700 font-medium pt-1">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Estado"
            placeholder="Ej: Sonora"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />

          <Input
            label="Ubicación / Ciudad"
            placeholder="Ej: Hermosillo, Sonora"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <Input
          label="Responsable o enlace municipal (opcional)"
          placeholder="Ej: Lic. David Castro - DIF Municipal"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />

        <div className="space-y-1.5">
          <label htmlFor="clone-desc" className="block text-sm font-medium text-slate-700">
            Descripción del proyecto de adaptación o construcción
          </label>
          <textarea
            id="clone-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-calm-600 focus:ring-1 focus:ring-calm-600"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
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
