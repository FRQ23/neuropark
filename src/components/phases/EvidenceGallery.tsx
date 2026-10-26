import React, { useState } from 'react';
import { EvidenceItem } from '../../types';
import { Modal } from '../common/Modal';
import { Trash2, ZoomIn, Calendar, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface EvidenceGalleryProps {
  evidence: EvidenceItem[];
  onDeleteEvidence?: (id: string) => void;
  canEdit?: boolean;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  evidence,
  onDeleteEvidence,
  canEdit = false,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<EvidenceItem | null>(null);

  if (!evidence || evidence.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
        <p className="text-xs text-slate-500">No hay fotos de evidencia adjuntas aún.</p>
      </div>
    );
  }

  const beforePhotos = evidence.filter((e) => e.type === 'before');
  const afterPhotos = evidence.filter((e) => e.type === 'after');

  return (
    <div className="space-y-4">
      {/* Before / After Comparison Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Before Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Estado Previo ("Antes")
            </span>
            <span className="text-xs text-slate-400">{beforePhotos.length} foto(s)</span>
          </div>
          {beforePhotos.length === 0 ? (
            <div className="h-32 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
              Sin foto previa
            </div>
          ) : (
            beforePhotos.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:shadow-soft transition-all"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedPhoto(item)}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn className="w-5 h-5 drop-shadow" />
                  </div>
                </div>
                <div className="p-2.5 text-xs space-y-1">
                  <p className="font-medium text-slate-800 line-clamp-2">{item.caption}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {item.uploadedBy}
                    </span>
                    {canEdit && onDeleteEvidence && (
                      <button
                        type="button"
                        onClick={() => onDeleteEvidence(item.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded"
                        title="Eliminar evidencia"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* After Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Adecuación Hecha ("Después")
            </span>
            <span className="text-xs text-slate-400">{afterPhotos.length} foto(s)</span>
          </div>
          {afterPhotos.length === 0 ? (
            <div className="h-32 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
              Sin foto posterior
            </div>
          ) : (
            afterPhotos.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-emerald-200/80 bg-white shadow-2xs hover:shadow-soft transition-all"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedPhoto(item)}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn className="w-5 h-5 drop-shadow" />
                  </div>
                </div>
                <div className="p-2.5 text-xs space-y-1">
                  <p className="font-medium text-slate-800 line-clamp-2">{item.caption}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {item.uploadedBy}
                    </span>
                    {canEdit && onDeleteEvidence && (
                      <button
                        type="button"
                        onClick={() => onDeleteEvidence(item.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded"
                        title="Eliminar evidencia"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.type === 'before' ? 'Evidencia Fotográfica: Antes' : 'Evidencia Fotográfica: Después'}
          maxWidth="2xl"
        >
          <div className="space-y-3">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="w-full max-h-[60vh] object-contain rounded-xl bg-slate-900/5 border border-slate-200"
            />
            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
              <p className="font-semibold text-sm text-slate-900">{selectedPhoto.caption}</p>
              <div className="flex items-center gap-4 text-slate-500 pt-1">
                <span>Subida por: <strong>{selectedPhoto.uploadedBy}</strong></span>
                <span>Fecha: <strong>{new Date(selectedPhoto.uploadedAt).toLocaleDateString('es-MX')}</strong></span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
