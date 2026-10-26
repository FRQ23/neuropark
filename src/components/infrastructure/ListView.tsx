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
      {/* Filters Bar */}
      <div className="w3-container w3-white w3-card w3-padding-16 w3-margin-bottom">
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

      {/* Items List */}
      <div>
        {filteredItems.map((item) => {
          const area = getArea(item.areaId);
          const category = getCategory(item.categoryId);
          const inf = getInfrastructure(item.infrastructureId);
          if (!inf) return null;

          const borderClass = item.isValidated
            ? 'w3-border-green'
            : item.isCompleted
            ? 'w3-border-blue'
            : 'w3-border-khaki';

          return (
            <div
              key={item.id}
              className={`w3-card w3-white w3-container w3-padding-16 w3-margin-bottom w3-leftbar ${borderClass}`}
            >
              <div className="w3-row">
                <div className="w3-col l8 m8 s12">
                  <div style={{ marginBottom: '6px' }}>
                    <span className="w3-tag w3-black w3-small" style={{ marginRight: '6px' }}>
                      {area?.name || 'Área'}
                    </span>
                    <span className="w3-tag w3-dark-grey w3-small" style={{ marginRight: '6px' }}>
                      {category?.name || 'Categoría'}
                    </span>
                    <span className="w3-tag w3-light-grey w3-border w3-small">
                      {inf.type === 'color_spec'
                        ? 'Color / Pintura'
                        : inf.type === 'equipment'
                        ? 'Aparato / Equipo'
                        : 'Infraestructura'}
                    </span>
                  </div>

                  <h3 style={{ margin: '6px 0' }}>{inf.name}</h3>

                  <div className="w3-panel w3-light-grey w3-small" style={{ padding: '8px', margin: '6px 0', fontFamily: 'monospace' }}>
                    <span className="w3-text-grey" style={{ display: 'block', fontFamily: 'inherit', fontWeight: 'bold' }}>
                      ESPECIFICACIÓN TÉCNICA:
                    </span>
                    {inf.colorOrSpec}
                  </div>

                  {item.notes && (
                    <p className="w3-small w3-text-grey" style={{ fontStyle: 'italic', margin: '4px 0' }}>
                      Nota: "{item.notes}"
                    </p>
                  )}

                  {item.validatedBy && (
                    <p className="w3-small w3-text-green font-bold" style={{ margin: '6px 0 0 0' }}>
                      <i className="fa fa-shield w3-margin-right"></i>
                      Validado por {item.validatedByName || item.validatedBy}
                      {item.validatedAt ? ` el ${new Date(item.validatedAt).toLocaleDateString('es-MX')}` : ''}
                    </p>
                  )}
                </div>

                {/* Right controls */}
                <div className="w3-col l4 m4 s12 w3-right-align w3-margin-top-small">
                  <div style={{ marginBottom: '10px' }}>
                    <label className="w3-small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="checkbox"
                        className="w3-check"
                        checked={item.isCompleted}
                        onChange={() => onToggleCompleted(item.id, item.isCompleted)}
                        disabled={!isAdmin && !isCommittee}
                      />
                      <b>¿Cambio físico hecho?</b>
                    </label>
                  </div>

                  <Button
                    size="sm"
                    variant={item.isValidated ? 'outline' : 'primary'}
                    onClick={() => onValidateItem(item.id, item.isValidated)}
                    disabled={!isAdmin && !isCommittee}
                    leftIcon={<i className="fa fa-shield"></i>}
                  >
                    {item.isValidated ? 'Validado' : 'Validar Cambio'}
                  </Button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="w3-button w3-hover-red w3-light-grey w3-small"
                      title="Eliminar registro"
                      style={{ marginLeft: '6px' }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="w3-container w3-white w3-card w3-padding-32 w3-center w3-text-grey">
            No se encontraron elementos de infraestructura con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};
