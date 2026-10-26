import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';

interface PhaseHeaderProps {
  order: number;
  name: string;
  description?: string;
  totalRequirements: number;
  completedRequirements: number;
  validatedRequirements: number;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
  order,
  name,
  description,
  totalRequirements,
  completedRequirements,
  validatedRequirements,
}) => {
  const percentage = totalRequirements > 0 ? (validatedRequirements / totalRequirements) * 100 : 0;

  return (
    <div className="card-calm p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-2 py-0.5 rounded">
              Fase {order}
            </span>
            <span className="text-xs text-slate-500">
              {validatedRequirements} de {totalRequirements} requisitos validados oficialmente
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{name}</h1>
          {description && <p className="text-sm text-slate-600 mt-1 max-w-3xl">{description}</p>}
        </div>

        <div className="md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 flex-shrink-0">
          <ProgressBar
            value={percentage}
            label="Avance de Validación"
            subLabel={`${validatedRequirements}/${totalRequirements}`}
            colorScheme={percentage === 100 ? 'emerald' : 'calm'}
          />
        </div>
      </div>
    </div>
  );
};
