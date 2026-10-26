import React, { useState } from 'react';
import { Area, NeurodivergenceCategory, Infrastructure, AreaCategoryInfrastructure } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface ListViewProps {
  areas: Area[];
  categories: NeurodivergenceCategory[];
  infrastructures: Infrastructure[];
  matrixItems: AreaCategoryInfrastructure[];
  onToggleCompleted: (id: string, current: boolean) => void;
  onValidateItem: (id: string, current: boolean) => void;
  onDeleteItem: (id: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  areas,
  categories,
  infrastructures,
  matrixItems,
  onToggleCompleted,
  onValidateItem,
  onDeleteItem,
}) => {
  const { isAdmin, isCommittee } = useAuth();
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredItems = matrixItems.filter((item) => {
    if (selectedArea !== 'all' && item.areaId !== selectedArea) return false;
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (selectedStatus === 'completed' && !item.isCompleted) return false;
    if (selectedStatus === 'pending' && item.isCompleted) return false;
    if (selectedStatus === 'validated' && !item.isValidated) return false;
    return true;
  });

  const getArea = (id: string) => areas.find((a) => a.id === id);
  const getCategory = (id: string) => categories.find((c) => c.id === id);
  const getInfrastructure = (id: string) => infrastructures.find((i) => i.id === id);

  return (
    <div>
      {/* Filters Bar (flat) */}
      <div className="w3-padding-16" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
          <div className="w3-col l4 m4 s12 w3-margin-bottom">
            <label htmlFor="filter-area" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
              <b>FILTRAR POR ÁREA</b>
            </label>
            <select
              id="filter-area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w3-select w3-border w3-white"
            >
              <option value="all">Todas las áreas ({areas.length})</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w3-col l4 m4 s12 w3-margin-bottom">
            <label htmlFor="filter-cat" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
              <b>FILTRAR POR CATEGORÍA</b>
            </label>
            <select
              id="filter-cat"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w3-select w3-border w3-white"
            >
              <option value="all">Todas las categorías ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w3-col l4 m4 s12 w3-margin-bottom">
            <label htmlFor="filter-status" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
              <b>ESTADO DE OBRA</b>
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w3-select w3-border w3-white"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Cambio físico realizado</option>
              <option value="pending">Pendiente de realización</option>
              <option value="validated">Validado oficialmente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table View */}
      <div className="w3-responsive" style={{ border: '1px solid #d1d5db', marginBottom: '24px' }}>
        <table className="w3-table-all w3-hoverable">
          <thead>
            <tr>
              <th style={{ width: '180px' }}>Área del Parque</th>
              <th style={{ width: '220px' }}>Categoría Neurodivergente</th>
              <th>Elemento / Adecuación</th>
              <th style={{ width: '110px' }}>Tipo</th>
              <th style={{ width: '160px' }}>Obra Física</th>
              <th style={{ width: '140px' }}>Dictamen</th>
              {isAdmin && <th style={{ width: '70px', textAlign: 'right' }}>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const area = getArea(item.areaId);
              const category = getCategory(item.categoryId);
              const inf = getInfrastructure(item.infrastructureId);
              if (!inf) return null;

              return (
                <tr key={item.id}>
                  <td>
                    <b>{area?.name || 'Área'}</b>
                  </td>
                  <td>
                    <span className="w3-tag w3-light-grey w3-border w3-small">
                      {category?.name || 'Categoría'}
                    </span>
                  </td>
                  <td>
                    <b>{inf.name}</b>
                    <div className="w3-small w3-text-grey" style={{ marginTop: '2px' }}>
                      {inf.colorOrSpec}
                    </div>
                    {item.notes && (
                      <div className="w3-tiny w3-text-grey" style={{ fontStyle: 'italic', marginTop: '2px' }}>
                        Nota: "{item.notes}"
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="w3-tag w3-black w3-tiny">
                      {inf.type === 'color_spec' ? 'Color' : inf.type === 'equipment' ? 'Equipo' : 'Obra'}
                    </span>
                  </td>
                  <td>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => onToggleCompleted(item.id, item.isCompleted)}
                        disabled={!isAdmin && !isCommittee}
                      />
                      <span className={item.isCompleted ? 'w3-text-green font-bold w3-small' : 'w3-text-grey w3-small'}>
                        {item.isCompleted ? 'Realizado' : 'Pendiente'}
                      </span>
                    </label>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onValidateItem(item.id, item.isValidated)}
                      disabled={!isAdmin && !isCommittee}
                      className={`w3-button w3-small ${item.isValidated ? 'w3-green' : 'w3-light-grey w3-border'}`}
                      style={{ padding: '3px 8px' }}
                      title={
                        item.isValidated
                          ? `Validado por ${item.validatedByName || item.validatedBy}`
                          : 'Validar como comité'
                      }
                    >
                      <i className="fa fa-shield w3-margin-right"></i>
                      {item.isValidated ? 'Validado' : 'Validar'}
                    </button>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="w3-button w3-hover-red w3-light-grey w3-small"
                        title="Eliminar registro"
                        style={{ padding: '3px 8px' }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="w3-padding-32 w3-center w3-text-grey" style={{ backgroundColor: '#ffffff' }}>
            No se encontraron elementos de infraestructura con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};
