import React from 'react';

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
  const percentage = totalRequirements > 0 ? Math.round((validatedRequirements / totalRequirements) * 100) : 0;

  return (
    <div className="w3-padding-16" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
      {/* Title & Phase Meta (Full width, prominent, no horizontal crowding) */}
      <div style={{ marginBottom: '6px' }}>
        <span className="w3-tag w3-black w3-small" style={{ marginRight: '8px', fontWeight: 'bold' }}>
          FASE {order}
        </span>
        <span className="w3-small w3-text-grey font-bold">
          CASO PILOTO: PARQUE COOPER • ENSENADA, B.C.
        </span>
      </div>

      <h1 className="w3-xlarge w3-wide" style={{ margin: '6px 0 8px 0', fontWeight: 'bold' }}>
        {name}
      </h1>

      {description && (
        <p className="w3-text-grey" style={{ margin: '0 0 16px 0', lineHeight: '1.6', maxWidth: '960px' }}>
          {description}
        </p>
      )}

      {/* Relocated progress bar: cleanly integrated below the title & description */}
      <div style={{ maxWidth: '640px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span className="w3-small font-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <i className="fa fa-tasks" style={{ marginRight: '6px' }}></i>
            Avance de Validación Oficial
          </span>
          <span className="w3-small font-bold">
            <span className="w3-text-grey" style={{ marginRight: '8px' }}>
              {validatedRequirements} de {totalRequirements} validados
            </span>
            <span className={`w3-tag ${percentage === 100 ? 'w3-green' : 'w3-black'} w3-small`}>
              {percentage}%
            </span>
          </span>
        </div>

        <div
          className="w3-light-grey w3-border"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Avance de validación"
          style={{ height: '12px', width: '100%' }}
        >
          <div
            className={percentage === 100 ? 'w3-green' : 'w3-black'}
            style={{
              width: `${percentage}%`,
              height: '100%',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};
