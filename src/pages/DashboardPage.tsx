import React, { useState, useEffect } from 'react';
import { parkApi, phaseApi, requirementApi, scheduleApi, associationApi } from '../services/api';
import { Park, Phase, Requirement, ParkRequirement, ParkSchedule, Association } from '../types';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck2,
  Sliders,
  Signpost,
  Sparkles,
  HeartHandshake,
  Calendar,
  MapPin,
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showSuccess } = useToast();

  const [parks, setParks] = useState<Park[]>([]);
  const [selectedParkId, setSelectedParkId] = useState<string>('park-ensenada-cooper');
  const [phases, setPhases] = useState<Phase[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [parkRequirements, setParkRequirements] = useState<ParkRequirement[]>([]);
  const [schedules, setSchedules] = useState<ParkSchedule[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [parksData, phasesData, reqsData, parkReqsData, schedsData, assocsData] =
        await Promise.all([
          parkApi.getAll(),
          phaseApi.getAll(),
          requirementApi.getAll(),
          requirementApi.getParkRequirements(selectedParkId),
          scheduleApi.getByPark(selectedParkId),
          associationApi.getAll(),
        ]);

      setParks(parksData);
      setPhases(phasesData);
      setRequirements(reqsData);
      setParkRequirements(parkReqsData);
      setSchedules(schedsData);
      setAssociations(assocsData);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedParkId]);

  const activePark = parks.find((p) => p.id === selectedParkId) || parks[0];

  const totalReqCount = parkRequirements.length;
  const validatedCount = parkRequirements.filter((pr) => pr.status === 'validated').length;
  const completedCount = parkRequirements.filter((pr) => pr.status === 'completed').length;
  const pendingCount = parkRequirements.filter((pr) => pr.status === 'pending').length;
  const inProgressCount = parkRequirements.filter((pr) => pr.status === 'in_progress').length;

  const isReadyToOpen = totalReqCount > 0 && validatedCount === totalReqCount;

  const handleOpenPark = async () => {
    if (!activePark || !isReadyToOpen) return;
    try {
      const updated = await parkApi.update(activePark.id, { status: 'open' });
      setParks((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showSuccess('¡Parque Abierto Oficialmente!', 'El estatus del parque ha cambiado a Abierto.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando tablero..." />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Header matching W3.CSS clean style */}
      <div className="w3-container w3-white w3-card p-6 sm:p-8 border-l-4 border-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w3-tag w3-black text-xs font-bold uppercase tracking-wider px-2.5 py-1">
                Caso Piloto Oficial
              </span>
              <span className="w3-tag w3-light-grey text-xs font-bold text-slate-800">
                {activePark?.state || 'Baja California'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {activePark?.name || 'Parque Cooper'}
            </h1>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-700" />
              <span>{activePark?.location || 'Ensenada, B.C.'}</span>
            </p>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed pt-1">
              {activePark?.description}
            </p>
          </div>

          {parks.length > 1 && (
            <div className="w-full md:w-auto">
              <label htmlFor="park-select" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Cambiar Parque:
              </label>
              <select
                id="park-select"
                value={selectedParkId}
                onChange={(e) => setSelectedParkId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2.5 font-bold"
              >
                {parks.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.state})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* W3.CSS Statistics Bar (Promo Section style) */}
      <div className="w3-container w3-grid w3-center w3-dark-grey w3-padding-32 rounded shadow-sm" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
        <div>
          <span className="w3-xxlarge font-extrabold text-white">
            {totalReqCount > 0 ? Math.round((validatedCount / totalReqCount) * 100) : 0}%
          </span>
          <br />
          <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Avance Global</span>
        </div>
        <div>
          <span className="w3-xxlarge font-extrabold text-white">{validatedCount} / {totalReqCount}</span>
          <br />
          <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Requisitos Validados</span>
        </div>
        <div>
          <span className="w3-xxlarge font-extrabold text-white">{schedules.length}</span>
          <br />
          <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Horarios Especiales</span>
        </div>
        <div>
          <span className="w3-xxlarge font-extrabold text-white">{associations.length}</span>
          <br />
          <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Fundaciones Aliadas</span>
        </div>
      </div>

      {/* "Listo para abrir" Status Hero Card */}
      <div
        className={`w3-card p-6 sm:p-8 rounded transition-all ${
          isReadyToOpen
            ? 'w3-pale-green border border-green-500 text-green-900'
            : 'w3-white border border-slate-300 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded flex items-center justify-center flex-shrink-0 font-bold ${
                isReadyToOpen ? 'w3-green text-white' : 'w3-black text-white'
              }`}
            >
              {isReadyToOpen ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded ${
                    isReadyToOpen ? 'w3-green text-white' : 'w3-light-grey text-black border border-slate-400'
                  }`}
                >
                  {isReadyToOpen ? 'Listo para abrir' : 'Apertura Bloqueada'}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {validatedCount} de {totalReqCount} validados
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {isReadyToOpen
                  ? '¡El parque cumple al 100% todos los dictámenes y puede inaugurarse!'
                  : 'Estatus: En adecuación progresiva (Bloqueado para apertura)'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {isReadyToOpen
                  ? 'Los comités de educación, psicología y finanzas han dictaminado y acreditado todos los requisitos de infraestructura, pintura y señalética.'
                  : `El parque no puede abrir al público hasta que todos los requisitos sean validados. Faltan ${
                      totalReqCount - validatedCount
                    } requisitos por dictaminar.`}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            {isReadyToOpen ? (
              <button
                type="button"
                onClick={handleOpenPark}
                disabled={activePark?.status === 'open' || !isAdmin}
                className="w3-button w3-black w3-padding-large w3-large w-full md:w-auto font-bold uppercase tracking-wider"
              >
                {activePark?.status === 'open'
                  ? 'Parque Inaugurado'
                  : 'Habilitar Apertura Oficial'}
              </button>
            ) : (
              <div className="w3-light-grey p-4 rounded border border-slate-300 text-xs max-w-xs">
                <span className="font-extrabold uppercase block mb-1">Regla de Apertura:</span>
                <p className="text-slate-600">
                  El candado permanecerá activo hasta completar la validación técnica en campo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <ProgressBar
            value={totalReqCount > 0 ? (validatedCount / totalReqCount) * 100 : 0}
            label="Avance de Validación Oficial"
            subLabel={`${validatedCount} de ${totalReqCount} requisitos`}
            size="md"
            colorScheme={isReadyToOpen ? 'emerald' : 'calm'}
          />
        </div>
      </div>

      {/* Phases Grid (Key features / 3 Columns like W3.CSS Team/About) */}
      <div>
        <div className="w3-container p-0 mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
            Fases de Adecuación
          </h2>
          <span className="text-xs text-slate-500 font-bold">Fases 1, 2 y 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase) => {
            const phaseReqs = requirements.filter((r) => r.phaseCode === phase.code);
            const phaseReqIds = phaseReqs.map((r) => r.id);
            const phaseParkReqs = parkRequirements.filter((pr) =>
              phaseReqIds.includes(pr.requirementId)
            );

            const total = phaseParkReqs.length;
            const valid = phaseParkReqs.filter((p) => p.status === 'validated').length;
            const comp = phaseParkReqs.filter((p) => p.status === 'completed').length;
            const pend = phaseParkReqs.filter((p) => p.status === 'pending' || p.status === 'in_progress').length;
            const percent = total > 0 ? Math.round((valid / total) * 100) : 0;

            return (
              <div
                key={phase.id}
                className="w3-card w3-white p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow border border-slate-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w3-tag w3-black text-xs font-bold uppercase tracking-wider px-2.5 py-1">
                      Fase {phase.order}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{percent}% validado</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                      {phase.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  <ProgressBar value={percent} size="sm" showPercentage={false} />

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="w3-light-grey p-2 rounded">
                      <span className="block font-bold text-slate-900">{valid}</span>
                      <span className="text-[10px] text-slate-600 uppercase font-semibold">Validados</span>
                    </div>
                    <div className="w3-light-grey p-2 rounded">
                      <span className="block font-bold text-slate-900">{comp}</span>
                      <span className="text-[10px] text-slate-600 uppercase font-semibold">Completos</span>
                    </div>
                    <div className="w3-light-grey p-2 rounded">
                      <span className="block font-bold text-slate-900">{pend}</span>
                      <span className="text-[10px] text-slate-600 uppercase font-semibold">Pendientes</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/parks/${selectedParkId}/${phase.code}`}
                  className="w3-button w3-black w3-block text-xs font-bold uppercase tracking-wider text-center py-2.5 mt-2"
                >
                  Abrir Checklist
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Items & Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending checks list (2 cols) */}
        <div className="lg:col-span-2 w3-card w3-white p-6 space-y-4 border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">
                Requisitos Pendientes de Dictamen
              </h2>
              <p className="text-xs text-slate-500">
                Elementos que requieren revisión de los comités de educación, psicología y finanzas
              </p>
            </div>
            <span className="w3-tag w3-black text-xs font-bold px-2.5 py-1">
              {totalReqCount - validatedCount} por validar
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {parkRequirements
              .filter((pr) => pr.status !== 'validated')
              .map((pr) => {
                const req = requirements.find((r) => r.id === pr.requirementId);
                if (!req) return null;
                const phase = phases.find((p) => p.code === req.phaseCode);

                return (
                  <div key={pr.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge status={pr.status} size="sm" />
                        <span className="text-[10px] font-bold uppercase text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {phase?.name || req.phaseCode}
                        </span>
                        {req.specialty && <Badge specialty={req.specialty} size="sm" />}
                      </div>
                      <p className="text-sm font-bold text-slate-900">{req.title}</p>
                      {pr.notes && <p className="text-xs text-slate-600 italic">"{pr.notes}"</p>}
                    </div>

                    <Link
                      to={`/parks/${selectedParkId}/${req.phaseCode}`}
                      className="w3-button w3-light-grey text-xs font-bold uppercase py-1.5 px-3 flex-shrink-0"
                    >
                      Revisar
                    </Link>
                  </div>
                );
              })}

            {totalReqCount - validatedCount === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                Todos los requisitos han sido validados exitosamente.
              </div>
            )}
          </div>
        </div>

        {/* Schedules quick widget (1 col) */}
        <div className="w3-card w3-white p-6 space-y-4 border border-slate-200 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-base font-bold uppercase tracking-wide text-slate-900">
              Horarios Especiales
            </h3>
            <Link
              to={`/parks/${selectedParkId}/schedules`}
              className="text-xs font-bold text-slate-900 uppercase hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="space-y-3">
            {schedules.map((s) => (
              <div key={s.id} className="w3-light-grey p-3.5 rounded border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{s.days.join(', ')}</span>
                  <span className="w3-tag w3-black text-[10px] font-bold px-2 py-0.5">
                    {s.startTime} - {s.endTime}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {s.restrictions[0] || 'Ambiente controlado'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
