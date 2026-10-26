import React from 'react';
import { Association } from '../../types';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

interface AssociationCardProps {
  association: Association;
  onEdit: (assoc: Association) => void;
  onDelete: (id: string) => void;
}

export const AssociationCard: React.FC<AssociationCardProps> = ({
  association,
  onEdit,
  onDelete,
}) => {
  const { isAdmin } = useAuth();

  return (
    <div className="w3-border w3-white w3-container w3-padding-16 w3-margin-bottom" style={{ borderColor: '#e5e7eb', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <Badge scope={association.scope} size="sm" />
            <h3 className="w3-large w3-wide" style={{ margin: '8px 0 4px 0', fontWeight: 'bold' }}>{association.name}</h3>
          </div>

          {isAdmin && (
            <div>
              <button
                type="button"
                onClick={() => onEdit(association)}
                className="w3-button w3-light-grey w3-small"
                title="Editar asociación"
                style={{ padding: '4px 8px', marginRight: '4px' }}
              >
                <i className="fa fa-pencil"></i>
              </button>
              <button
                type="button"
                onClick={() => onDelete(association.id)}
                className="w3-button w3-hover-red w3-light-grey w3-small"
                title="Eliminar asociación"
                style={{ padding: '4px 8px' }}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          )}
        </div>

        {/* Contact info list */}
        <div className="w3-small w3-text-dark-grey" style={{ lineHeight: '1.8' }}>
          <p style={{ margin: '2px 0' }}>
            <i className="fa fa-user w3-margin-right w3-text-grey"></i>
            <b>Contacto:</b> {association.contactPerson}
          </p>

          <p style={{ margin: '2px 0' }}>
            <i className="fa fa-envelope w3-margin-right w3-text-grey"></i>
            <a href={`mailto:${association.email}`} className="w3-text-dark-grey">
              {association.email}
            </a>
          </p>

          <p style={{ margin: '2px 0' }}>
            <i className="fa fa-phone w3-margin-right w3-text-grey"></i>
            {association.phone}
          </p>

          {(association.address || association.state) && (
            <p style={{ margin: '2px 0' }}>
              <i className="fa fa-map-marker w3-margin-right w3-text-grey"></i>
              {association.address ? `${association.address}, ` : ''}{association.state}
            </p>
          )}

          {association.website && (
            <p style={{ margin: '2px 0' }}>
              <i className="fa fa-globe w3-margin-right w3-text-grey"></i>
              <a
                href={association.website}
                target="_blank"
                rel="noreferrer"
                className="w3-text-dark-grey"
              >
                {association.website.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}
        </div>
      </div>

      {association.notes && (
        <div className="w3-panel w3-light-grey w3-tiny w3-padding-small" style={{ fontStyle: 'italic', margin: '12px 0 0 0' }}>
          "{association.notes}"
        </div>
      )}
    </div>
  );
};
