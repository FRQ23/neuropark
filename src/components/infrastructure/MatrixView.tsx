import React from 'react';
import { Area, NeurodivergenceCategory, Infrastructure, AreaCategoryInfrastructure } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface MatrixViewProps {
  areas: Area[];
  categories: NeurodivergenceCategory[];
  infrastructures: Infrastructure[];
  matrixItems: AreaCategoryInfrastructure[];
  onToggleCompleted: (id: string, current: boolean) => void;
  onValidateItem: (id: string, current: boolean) => void;
  onOpenLinkModal: (areaId?: string, categoryId?: string) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  areas,
  categories,
  infrastructures,
  matrixItems,
  onToggleCompleted,
  onValidateItem,
  onOpenLinkModal,
}) => {
  const { isAdmin, isCommittee } = useAuth();

  const getInfrastructureById = (id: string) => infrastructures.find((i) => i.id === id);

  return (
    <div className="w3-border w3-white w3-margin-bottom" style={{ borderColor: '#d1d5db' }}>
      <div className="w3-container w3-light-grey w3-padding-16" style={{ borderBottom: '1px solid #d1d5db', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 className="w3-medium w3-wide" style={{ margin: 0, fontWeight: 'bold' }}>
            <i className="fa fa-th w3-margin-right"></i>
            MATRIZ CRUZADA: ÁREAS VS. CATEGORÍAS
          </h3>
          <p className="w3-small w3-text-grey" style={{ margin: '2px 0 0 0' }}>
            Distribución de equipamiento, paleta cromática mate y obras en cada zona del parque.
          </p>
        </div>
        {isAdmin && (
          <Button
            size="sm"
            onClick={() => onOpenLinkModal()}
            leftIcon={<i className="fa fa-plus"></i>}
          >
            Vincular Requisito
          </Button>
        )}
      </div>

      <div className="w3-responsive">
        <table className="w3-table-all w3-hoverable" style={{ minWidth: '750px' }}>
          <thead>
            <tr>
              <th style={{ width: '220px', verticalAlign: 'middle' }}>Área del Parque</th>
              {categories.map((cat) => (
                <th key={cat.id} style={{ minWidth: '220px', verticalAlign: 'middle' }}>
                  <span className="w3-block font-bold">{cat.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                {/* Area Row Header */}
                <td style={{ verticalAlign: 'top', backgroundColor: '#f9fafb', width: '220px' }}>
                  <b>{area.name}</b>
                  {area.description && (
                    <p className="w3-tiny w3-text-grey" style={{ margin: '4px 0 0 0' }}>
                      {area.description}
                    </p>
                  )}
                </td>

                {/* Cells for each Category */}
                {categories.map((cat) => {
                  const cellItems = matrixItems.filter(
                    (item) => item.areaId === area.id && item.categoryId === cat.id
                  );

                  return (
                    <td key={cat.id} className="matrix-cell">
                      {cellItems.map((item) => {
                        const inf = getInfrastructureById(item.infrastructureId);
                        if (!inf) return null;

                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '8px 0',
                              borderBottom: cellItems.length > 1 ? '1px solid #f0f0f0' : 'none',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                              <b className="w3-small">{inf.name}</b>
                              <span className="w3-tag w3-black w3-tiny">
                                {inf.type === 'color_spec' ? 'Color' : inf.type === 'equipment' ? 'Equipo' : 'Obra'}
                              </span>
                            </div>

                            <div className="w3-tiny w3-text-grey" style={{ margin: '2px 0 6px 0' }}>
                              {inf.colorOrSpec}
                            </div>

                            {item.notes && (
                              <div className="w3-tiny w3-text-grey" style={{ fontStyle: 'italic', margin: '2px 0 6px 0' }}>
                                "{item.notes}"
                              </div>
                            )}

                            {/* Status toggles */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                              <label className="w3-tiny" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                  type="checkbox"
                                  checked={item.isCompleted}
                                  onChange={() => onToggleCompleted(item.id, item.isCompleted)}
                                  disabled={!isAdmin && !isCommittee}
                                />
                                <span>Hecho</span>
                              </label>

                              <button
                                type="button"
                                onClick={() => onValidateItem(item.id, item.isValidated)}
                                disabled={!isAdmin && !isCommittee}
                                className={`w3-button w3-tiny ${
                                  item.isValidated ? 'w3-green' : 'w3-light-grey w3-border'
                                }`}
                                style={{ padding: '2px 6px' }}
                                title={
                                  item.isValidated
                                    ? `Validado por ${item.validatedByName || item.validatedBy}`
                                    : 'Validar como comité'
                                }
                              >
                                <i className="fa fa-shield w3-margin-right"></i>
                                {item.isValidated ? 'Validado' : 'Validar'}
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {cellItems.length === 0 && (
                        <div style={{ padding: '8px 0', color: '#9ca3af', fontSize: '13px' }}>
                          —
                        </div>
                      )}

                      {isAdmin && (
                        <div style={{ marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => onOpenLinkModal(area.id, cat.id)}
                            className="w3-button w3-hover-light-grey w3-tiny w3-text-grey"
                            style={{ padding: '2px 4px', textDecoration: 'none' }}
                          >
                            <i className="fa fa-plus w3-margin-right"></i>Asignar
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
