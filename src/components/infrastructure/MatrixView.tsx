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
    <div className="w3-border w3-white w3-margin-bottom">
      <div className="w3-container w3-light-grey w3-padding-16" style={{ borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 className="w3-large w3-wide" style={{ margin: 0 }}>
            MATRIZ CRUZADA: ÁREAS VS. CATEGORÍAS
          </h3>
          <p className="w3-small w3-text-grey" style={{ margin: '4px 0 0 0' }}>
            Mapeo interactivo: qué infraestructura, equipo biomecánico o color se requiere en cada zona.
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
        <table className="w3-table w3-bordered w3-striped w3-white" style={{ minWidth: '700px' }}>
          <thead>
            <tr className="w3-dark-grey">
              <th style={{ width: '220px', verticalAlign: 'top' }}>Área del Parque</th>
              {categories.map((cat) => (
                <th key={cat.id} style={{ minWidth: '240px', verticalAlign: 'top' }}>
                  <b className="w3-block">{cat.name}</b>
                  <span className="w3-tiny" style={{ fontWeight: 'normal', opacity: 0.85 }}>
                    {cat.description}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                {/* Area Row Header */}
                <td style={{ verticalAlign: 'top', backgroundColor: '#fdfdfd' }}>
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
                    <td key={cat.id} style={{ verticalAlign: 'top', padding: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100px', justifyContent: 'space-between' }}>
                        <div>
                          {cellItems.map((item) => {
                            const inf = getInfrastructureById(item.infrastructureId);
                            if (!inf) return null;

                            return (
                              <div
                                key={item.id}
                                className={`w3-panel w3-border ${
                                  item.isValidated
                                    ? 'w3-pale-green w3-leftbar w3-border-green'
                                    : item.isCompleted
                                    ? 'w3-pale-blue w3-leftbar w3-border-blue'
                                    : 'w3-light-grey'
                                }`}
                                style={{ padding: '8px', margin: '4px 0' }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <b>{inf.name}</b>
                                  <span className="w3-tag w3-black w3-tiny">
                                    {inf.type === 'color_spec' ? 'Color' : inf.type === 'equipment' ? 'Equipo' : 'Obra'}
                                  </span>
                                </div>

                                <div className="w3-tiny w3-text-dark-grey" style={{ fontFamily: 'monospace', margin: '4px 0' }}>
                                  {inf.colorOrSpec}
                                </div>

                                {item.notes && (
                                  <p className="w3-tiny w3-text-grey" style={{ fontStyle: 'italic', margin: '4px 0' }}>
                                    "{item.notes}"
                                  </p>
                                )}

                                {/* Physical validation status */}
                                <div style={{ borderTop: '1px solid #ddd', paddingTop: '6px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <label className="w3-tiny" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                      type="checkbox"
                                      className="w3-check"
                                      style={{ width: '16px', height: '16px' }}
                                      checked={item.isCompleted}
                                      onChange={() => onToggleCompleted(item.id, item.isCompleted)}
                                      disabled={!isAdmin && !isCommittee}
                                    />
                                    <span>¿Hecho?</span>
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
                                        : 'Validar oficialmente como comité'
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
                            <p className="w3-tiny w3-text-grey w3-center" style={{ fontStyle: 'italic', padding: '12px 0' }}>
                              Sin requisitos
                            </p>
                          )}
                        </div>

                        {/* Add button inside cell */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => onOpenLinkModal(area.id, cat.id)}
                            className="w3-button w3-light-grey w3-block w3-tiny w3-border"
                            style={{ marginTop: '6px', padding: '4px' }}
                          >
                            <i className="fa fa-plus w3-margin-right"></i>Asignar
                          </button>
                        )}
                      </div>
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
