import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Upload, Image as ImageIcon } from 'lucide-react';
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Tipo de fotografía de evidencia"
          value={type}
          onChange={(e) => setType(e.target.value as 'before' | 'after')}
          options={[
            { value: 'after', label: 'Estado Posterior / Adecuación Realizada ("Después")' },
            { value: 'before', label: 'Estado Original / Previo a la Adecuación ("Antes")' },
          ]}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Archivo fotográfico <span className="text-rose-500">*</span>
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-calm-500 transition-colors bg-slate-50/50">
            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="max-h-48 mx-auto rounded-lg object-cover shadow-sm border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl('')}
                  className="text-xs text-rose-600 hover:underline font-medium"
                >
                  Cambiar imagen
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block py-4">
                <Upload className="w-8 h-8 text-calm-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-slate-700 block">
                  Haz clic para seleccionar o arrastra una foto
                </span>
                <span className="text-xs text-slate-500 block mt-1">PNG, JPG, WebP (cliente local)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
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

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
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
