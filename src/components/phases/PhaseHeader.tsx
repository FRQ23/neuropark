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
    <div className="w3-container w3-white w3-card w3-padding-24 w3-margin-bottom">
      <div className="w3-row">
        <div className="w3-col l8 m12 s12">
          <div style={{ marginBottom: '8px' }}>
            <span className="w3-tag w3-black w3-small" style={{ marginRight: '8px' }}>
              FASE {order}
            </span>
            <span className="w3-small w3-text-grey">
              {validatedRequirements} de {totalRequirements} requisitos validados oficialmente
            </span>
          </div>
          <h2 style={{ margin: '6px 0' }} className="w3-wide">{name}</h2>
          {description && (
            <p className="w3-text-grey" style={{ margin: '6px 0 0 0', lineHeight: '1.6' }}>
              {description}
            </p>
          )}
        </div>

        <div className="w3-col l4 m12 s12 w3-margin-top">
          <div className="w3-container w3-light-grey w3-border w3-padding-16">
            <ProgressBar
              value={percentage}
              label="Avance de Validación"
              subLabel={`${validatedRequirements}/${totalRequirements}`}
              colorScheme={percentage === 100 ? 'emerald' : 'calm'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
