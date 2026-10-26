import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useAuth } from '../../context/AuthContext';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (evidence: { type: 'before' | 'after'; url: string; caption: string; uploadedBy: string }) => void;
  title?: string;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  title = 'Adjuntar Evidencia Fotográfica',
}) => {
  const { currentUser } = useAuth();
  const [type, setType] = useState<'before' | 'after'>('after');
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      setError('Debes cargar una fotografía de evidencia.');
      return;
    }
    if (!caption.trim()) {
      setError('Ingresa una descripción o leyenda breve para la fotografía.');
      return;
    }

    onUpload({
      type,
      url: previewUrl,
      caption: caption.trim(),
      uploadedBy: currentUser?.name || 'Usuario',
    });

    // Reset & close
    setPreviewUrl('');
    setCaption('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Select
          label="Tipo de fotografía de evidencia"
          value={type}
          onChange={(e) => setType(e.target.value as 'before' | 'after')}
          options={[
            { value: 'after', label: 'Estado Posterior / Adecuación Realizada ("Después")' },
            { value: 'before', label: 'Estado Original / Previo a la Adecuación ("Antes")' },
          ]}
        />

        <div className="w3-margin-bottom">
          <label className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
            <b>Archivo fotográfico</b> <span className="w3-text-red">*</span>
          </label>
          <div className="w3-panel w3-light-grey w3-border w3-padding-24 w3-center">
            {previewUrl ? (
              <div>
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'cover', margin: '0 auto', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl('')}
                  className="w3-button w3-text-red w3-small w3-margin-top"
                >
                  Cambiar imagen
                </button>
              </div>
            ) : (
              <label style={{ cursor: 'pointer', display: 'block' }}>
                <p>
                  <i className="fa fa-upload w3-xxlarge w3-text-dark-grey"></i>
                </p>
                <b className="w3-block">Haz clic para seleccionar o subir foto</b>
                <span className="w3-tiny w3-text-grey">PNG, JPG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>

        <Input
          label="Descripción de la evidencia"
          placeholder="Ej: Pintura mate aplicada en resbaladillas para evitar deslumbramiento"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />

        {error && <p className="w3-small w3-text-red">{error}</p>}

        <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ marginRight: '8px' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={!previewUrl}>
            Guardar Evidencia
          </Button>
        </div>
      </form>
    </Modal>
  );
};
