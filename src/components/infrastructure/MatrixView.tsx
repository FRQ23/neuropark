import React, { useState } from 'react';
import { Area, NeurodivergenceCategory, Infrastructure, AreaCategoryInfrastructure } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Check, Clock, Plus, ShieldCheck, Camera, Sparkles } from 'lucide-react';

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
  const { isAdmin, isCommittee, currentUser } = useAuth();

  const getInfrastructureById = (id: string) => infrastructures.find((i) => i.id === id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Matriz Cruzada: Áreas vs. Categorías de Neurodivergencia</span>
            <span className="text-xs bg-calm-100 text-calm-800 font-semibold px-2 py-0.5 rounded-full">
              Fase 2
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeo interactivo: qué infraestructura, equipo biomecánico o color se requiere en cada zona.
          </p>
        </div>
        {isAdmin && (
          <Button
            size="sm"
            onClick={() => onOpenLinkModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Vincular Requisito
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 w-56 sticky left-0 bg-slate-100 z-10 border-r border-slate-200">
                Área del Parque
              </th>
              {categories.map((cat) => (
                <th key={cat.id} className="p-4 min-w-[260px] border-r border-slate-200 last:border-r-0">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 normal-case block text-sm">
                      {cat.name}
                    </span>
                    <p className="text-[11px] font-normal text-slate-500 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {areas.map((area) => (
              <tr key={area.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Area Row Header */}
                <td className="p-4 font-semibold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50/60 z-10 border-r border-slate-200">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-calm-800">{area.name}</p>
                    {area.description && (
                      <p className="text-[11px] font-normal text-slate-500 leading-relaxed">
                        {area.description}
                      </p>
                    )}
                  </div>
                </td>

                {/* Cells for each Category */}
                {categories.map((cat) => {
                  const cellItems = matrixItems.filter(
                    (item) => item.areaId === area.id && item.categoryId === cat.id
                  );

                  return (
                    <td
                      key={cat.id}
                      className="p-3 align-top border-r border-slate-200 last:border-r-0 bg-slate-50/20"
                    >
                      <div className="space-y-2.5 min-h-[110px] flex flex-col justify-between">
                        <div className="space-y-2">
                          {cellItems.map((item) => {
                            const inf = getInfrastructureById(item.infrastructureId);
                            if (!inf) return null;

                            return (
                              <div
                                key={item.id}
                                className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                                  item.isValidated
                                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                                    : item.isCompleted
                                    ? 'bg-teal-50/60 border-teal-300 text-teal-950'
                                    : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <span className="font-semibold text-slate-900 block leading-tight">
                                    {inf.name}
                                  </span>
                                  <span
                                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                      inf.type === 'color_spec'
                                        ? 'bg-amber-100 text-amber-800'
                                        : inf.type === 'equipment'
                                        ? 'bg-sky-100 text-sky-800'
                                        : 'bg-indigo-100 text-indigo-800'
                                    }`}
                                  >
                                    {inf.type === 'color_spec' ? 'Color' : inf.type === 'equipment' ? 'Equipo' : 'Obra'}
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-600 bg-white/70 p-1.5 rounded border border-slate-100 font-mono">
                                  {inf.colorOrSpec}
                                </div>

                                {item.notes && (
                                  <p className="text-[11px] text-slate-500 italic line-clamp-2">
                                    "{item.notes}"
                                  </p>
                                )}

                                {/* Physical validation status */}
                                <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between gap-2 text-[11px]">
                                  {/* Change completed checkbox */}
                                  <label
                                    className={`flex items-center gap-1.5 cursor-pointer font-medium select-none ${
                                      item.isCompleted ? 'text-teal-700' : 'text-slate-500'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={item.isCompleted}
                                      onChange={() => onToggleCompleted(item.id, item.isCompleted)}
                                      disabled={!isAdmin && !isCommittee}
                                      className="rounded text-calm-600 focus:ring-calm-500 w-3.5 h-3.5"
                                    />
                                    <span>¿Cambio físico hecho?</span>
                                  </label>

                                  {/* Specialty validation */}
                                  <button
                                    type="button"
                                    onClick={() => onValidateItem(item.id, item.isValidated)}
                                    disabled={!isAdmin && !isCommittee}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                                      item.isValidated
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                    title={
                                      item.isValidated
                                        ? `Validado por ${item.validatedByName || item.validatedBy}`
                                        : 'Validar oficialmente como comité'
                                    }
                                  >
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>{item.isValidated ? 'Validado' : 'Validar'}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {cellItems.length === 0 && (
                            <p className="text-slate-400 italic text-[11px] py-3 text-center">
                              Sin requisitos asignados
                            </p>
                          )}
                        </div>

                        {/* Add button inside cell */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => onOpenLinkModal(area.id, cat.id)}
                            className="w-full py-1.5 text-center text-slate-500 hover:text-calm-700 hover:bg-white rounded-lg border border-dashed border-slate-200 hover:border-calm-300 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Asignar equipo</span>
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
