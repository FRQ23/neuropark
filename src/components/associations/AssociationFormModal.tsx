import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Association, AssociationScope } from '../../types';

interface AssociationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assoc: Omit<Association, 'id'>) => void;
  association?: Association | null;
}

export const AssociationFormModal: React.FC<AssociationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  association,
}) => {
  const [name, setName] = useState(association?.name || '');
  const [contactPerson, setContactPerson] = useState(association?.contactPerson || '');
  const [scope, setScope] = useState<AssociationScope>(association?.scope || 'local');
  const [email, setEmail] = useState(association?.email || '');
  const [phone, setPhone] = useState(association?.phone || '');
  const [address, setAddress] = useState(association?.address || '');
  const [state, setState] = useState(association?.state || 'Baja California');
  const [website, setWebsite] = useState(association?.website || '');
  const [notes, setNotes] = useState(association?.notes || '');
  const [isExample, setIsExample] = useState(association?.isExample ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactPerson.trim() || !email.trim()) {
      alert('Por favor completa los campos requeridos (Nombre, Contacto, Correo).');
      return;
    }

    onSave({
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      scope,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      state: state.trim(),
      website: website.trim(),
      notes: notes.trim(),
      isExample,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={association ? 'Editar Asociación / Fundación' : 'Registrar Nueva Asociación Afiliada'}
      description="Directorio de organizaciones civiles que respaldan la apertura, replican el modelo o donan insumos."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre de la Asociación o Fundación"
          placeholder="Ej: Fundación Apoyo Autismo B.C."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-half">
            <Input
              label="Persona de enlace / contacto"
              placeholder="Ej: Lic. Mariana Cárdenas"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div className="w3-half">
            <Select
              label="Alcance territorial"
              value={scope}
              onChange={(e) => setScope(e.target.value as AssociationScope)}
              options={[
                { value: 'local', label: 'Local (Ensenada / Municipio)' },
                { value: 'estatal', label: 'Estatal (Baja California / Otro estado)' },
                { value: 'nacional', label: 'Nacional (México)' },
                { value: 'internacional', label: 'Internacional' },
              ]}
            />
          </div>
        </div>

        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-half">
            <Input
              label="Correo electrónico de contacto"
              type="email"
              placeholder="contacto@organizacion.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w3-half">
            <Input
              label="Teléfono de contacto"
              placeholder="646-123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-half">
            <Input
              label="Estado / Ciudad"
              placeholder="Ej: Ensenada, Baja California"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="w3-half">
            <Input
              label="Sitio web o enlace (opcional)"
              type="url"
              placeholder="https://asociacion.org"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        <Input
          label="Dirección física / Sede"
          placeholder="Calle, número, colonia"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="w3-margin-bottom">
          <label htmlFor="assoc-notes" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Notas de colaboración o acuerdos vigentes</b>
          </label>
          <textarea
            id="assoc-notes"
            rows={3}
            placeholder="Convenio de colaboración firmado, apoyo técnico en sensibilización comunitaria..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w3-input w3-border"
          />
        </div>

        <div style={{ margin: '12px 0' }}>
          <label htmlFor="assoc-example-check" className="w3-small" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              id="assoc-example-check"
              className="w3-check"
              checked={isExample}
              onChange={(e) => setIsExample(e.target.checked)}
            />
            <span>Marcar como dato de ejemplo (placeholder de prueba)</span>
          </label>
        </div>

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {association ? 'Actualizar Asociación' : 'Guardar Asociación'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
