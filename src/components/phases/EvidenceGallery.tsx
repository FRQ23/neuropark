import React, { useState } from 'react';
import { EvidenceItem } from '../../types';
import { Modal } from '../common/Modal';

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
      <div className="w3-panel w3-light-grey w3-border w3-padding-small w3-center">
        <p className="w3-small w3-text-grey" style={{ margin: 0 }}>No hay fotos de evidencia adjuntas aún.</p>
      </div>
    );
  }

  const beforePhotos = evidence.filter((e) => e.type === 'before');
  const afterPhotos = evidence.filter((e) => e.type === 'after');

  return (
    <div style={{ marginTop: '8px' }}>
      <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
        {/* Before Section */}
        <div className="w3-col l6 m6 s12 w3-margin-bottom">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="w3-tag w3-khaki w3-small">ESTADO PREVIO ("ANTES")</span>
            <span className="w3-tiny w3-text-grey">{beforePhotos.length} foto(s)</span>
          </div>

          {beforePhotos.length === 0 ? (
            <div className="w3-panel w3-light-grey w3-border w3-padding-16 w3-center w3-tiny w3-text-grey">
              Sin foto previa
            </div>
          ) : (
            beforePhotos.map((item) => (
              <div key={item.id} className="w3-card w3-white w3-padding-small w3-margin-bottom">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w3-hover-opacity"
                  style={{ width: '100%', height: '160px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setSelectedPhoto(item)}
                />
                <p className="w3-small" style={{ margin: '6px 0 2px 0', fontWeight: 'bold' }}>{item.caption}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="w3-tiny w3-text-grey">
                    <i className="fa fa-user w3-margin-right"></i>{item.uploadedBy}
                  </span>
                  {canEdit && onDeleteEvidence && (
                    <button
                      type="button"
                      onClick={() => onDeleteEvidence(item.id)}
                      className="w3-button w3-hover-red w3-tiny"
                      style={{ padding: '2px 6px' }}
                      title="Eliminar evidencia"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* After Section */}
        <div className="w3-col l6 m6 s12 w3-margin-bottom">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="w3-tag w3-green w3-small">ADECUACIÓN HECHA ("DESPUÉS")</span>
            <span className="w3-tiny w3-text-grey">{afterPhotos.length} foto(s)</span>
          </div>

          {afterPhotos.length === 0 ? (
            <div className="w3-panel w3-light-grey w3-border w3-padding-16 w3-center w3-tiny w3-text-grey">
              Sin foto posterior
            </div>
          ) : (
            afterPhotos.map((item) => (
              <div key={item.id} className="w3-card w3-white w3-padding-small w3-margin-bottom">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w3-hover-opacity"
                  style={{ width: '100%', height: '160px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setSelectedPhoto(item)}
                />
                <p className="w3-small" style={{ margin: '6px 0 2px 0', fontWeight: 'bold' }}>{item.caption}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="w3-tiny w3-text-grey">
                    <i className="fa fa-user w3-margin-right"></i>{item.uploadedBy}
                  </span>
                  {canEdit && onDeleteEvidence && (
                    <button
                      type="button"
                      onClick={() => onDeleteEvidence(item.id)}
                      className="w3-button w3-hover-red w3-tiny"
                      style={{ padding: '2px 6px' }}
                      title="Eliminar evidencia"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
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
          maxWidth="lg"
        >
          <div>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain' }}
            />
            <div className="w3-panel w3-light-grey w3-padding-small w3-margin-top">
              <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedPhoto.caption}</p>
              <p className="w3-small w3-text-grey" style={{ margin: '4px 0 0 0' }}>
                Subida por: <b>{selectedPhoto.uploadedBy}</b> • Fecha: <b>{new Date(selectedPhoto.uploadedAt).toLocaleDateString('es-MX')}</b>
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
