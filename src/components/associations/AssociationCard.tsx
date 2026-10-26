import React from 'react';
import { Association } from '../../types';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, MapPin, Globe, Edit2, Trash2, HeartHandshake } from 'lucide-react';

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
    <article
      aria-label={`Asociación: ${association.name}`}
      className="card-calm p-5 space-y-4 hover:shadow-soft-lg transition-all flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge scope={association.scope} size="sm" />
              {association.isExample && (
                <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-medium">
                  Ejemplo
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-800 leading-snug">
              {association.name}
            </h3>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(association)}
                className="p-1.5 text-slate-400 hover:text-calm-700 hover:bg-slate-100 rounded-lg"
                title="Editar asociación"
                aria-label="Editar asociación"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(association.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                title="Eliminar asociación"
                aria-label="Eliminar asociación"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Contact info list */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-calm-600 flex-shrink-0" />
            <span>Contacto: {association.contactPerson}</span>
          </p>

          <p className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <a
              href={`mailto:${association.email}`}
              className="text-calm-700 hover:underline truncate"
            >
              {association.email}
            </a>
          </p>

          <p className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{association.phone}</span>
          </p>

          {(association.address || association.state) && (
            <p className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">
                {association.address ? `${association.address}, ` : ''}
                {association.state}
              </span>
            </p>
          )}

          {association.website && (
            <p className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <a
                href={association.website}
                target="_blank"
                rel="noreferrer"
                className="text-calm-700 hover:underline truncate"
              >
                {association.website.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}
        </div>
      </div>

      {association.notes && (
        <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/60">
          <p className="italic font-normal">"{association.notes}"</p>
        </div>
      )}
    </article>
  );
};
