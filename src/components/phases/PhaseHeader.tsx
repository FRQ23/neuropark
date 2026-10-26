import React from 'react';
import { ProgressBar } from '../common/ProgressBar';

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
  validatedRequirements,
}) => {
  const percentage = totalRequirements > 0 ? (validatedRequirements / totalRequirements) * 100 : 0;

  return (
    <div className="w3-padding-24" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
      <div className="w3-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div className="w3-col l8 m7 s12">
          <div style={{ marginBottom: '6px' }}>
            <span className="w3-tag w3-black w3-small" style={{ marginRight: '8px', fontWeight: 'bold' }}>
              FASE {order}
            </span>
            <span className="w3-small w3-text-grey">
              {validatedRequirements} de {totalRequirements} validados
            </span>
          </div>
          <h2 style={{ margin: '4px 0', fontWeight: 'bold' }}>{name}</h2>
          {description && (
            <p className="w3-text-grey" style={{ margin: '4px 0 0 0', lineHeight: '1.5' }}>
              {description}
            </p>
          )}
        </div>

        <div className="w3-col l4 m5 s12" style={{ minWidth: '220px' }}>
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
