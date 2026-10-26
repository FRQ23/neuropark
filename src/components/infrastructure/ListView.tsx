import React, { useState } from 'react';
import { Area, NeurodivergenceCategory, Infrastructure, AreaCategoryInfrastructure } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Check, ShieldCheck, Camera, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filter-area" className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Filtrar por Área
          </label>
          <select
            id="filter-area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">Todas las áreas ({areas.length})</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filter-cat" className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Filtrar por Categoría
          </label>
          <select
            id="filter-cat"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">Todas las categorías ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label htmlFor="filter-status" className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Estado de Obra / Cambio
          </label>
          <select
            id="filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="completed">✓ Cambio físico realizado</option>
            <option value="pending">⏳ Pendiente de realización</option>
            <option value="validated">🛡️ Validado oficialmente</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const area = getArea(item.areaId);
          const category = getCategory(item.categoryId);
          const inf = getInfrastructure(item.infrastructureId);
          if (!inf) return null;

          return (
            <div
              key={item.id}
              className={`card-calm p-5 border-l-4 transition-all ${
                item.isValidated
                  ? 'border-l-emerald-600 bg-emerald-50/20'
                  : item.isCompleted
                  ? 'border-l-teal-500'
                  : 'border-l-amber-400'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-calm-800 bg-calm-100 px-2 py-0.5 rounded">
                      {area?.name || 'Área'}
                    </span>
                    <span className="text-xs font-medium text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {category?.name || 'Categoría'}
                    </span>
                    <span
                      className={`text-[11px] uppercase font-bold px-2 py-0.5 rounded ${
                        inf.type === 'color_spec'
                          ? 'bg-amber-100 text-amber-800'
                          : inf.type === 'equipment'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {inf.type === 'color_spec'
                        ? 'Color / Pintura'
                        : inf.type === 'equipment'
                        ? 'Aparato / Equipo'
                        : 'Infraestructura'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 leading-snug">{inf.name}</h3>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                    <span className="font-semibold text-slate-900 block font-sans text-[11px] uppercase tracking-wider mb-0.5">
                      Especificación técnica / color:
                    </span>
                    {inf.colorOrSpec}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-600 italic">
                      Nota de campo: "{item.notes}"
                    </p>
                  )}

                  {item.validatedBy && (
                    <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 pt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Validado por <strong>{item.validatedByName || item.validatedBy}</strong> el{' '}
                      {item.validatedAt ? new Date(item.validatedAt).toLocaleDateString('es-MX') : ''}
                    </p>
                  )}
                </div>

                {/* Right controls */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 flex-shrink-0">
                  {/* Physical change check */}
                  <label
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer select-none transition-colors ${
                      item.isCompleted
                        ? 'bg-teal-50 border-teal-300 text-teal-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => onToggleCompleted(item.id, item.isCompleted)}
                      disabled={!isAdmin && !isCommittee}
                      className="rounded text-calm-600 focus:ring-calm-500 w-4 h-4"
                    />
                    <span>¿Cambio físico hecho?</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={item.isValidated ? 'outline' : 'primary'}
                      onClick={() => onValidateItem(item.id, item.isValidated)}
                      disabled={!isAdmin && !isCommittee}
                      leftIcon={<ShieldCheck className="w-4 h-4" />}
                    >
                      {item.isValidated ? 'Validado' : 'Validar Cambio'}
                    </Button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            No se encontraron elementos de infraestructura con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};
