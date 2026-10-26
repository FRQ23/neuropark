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
  AlertCircle,
  Clock,
  ArrowRight,
  FileCheck2,
  Sliders,
  Signpost,
  Sparkles,
  HeartHandshake,
  Calendar,
  Camera,
  MapPin,
  ExternalLink,
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

  // Requirements metrics
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
    return <LoadingSpinner message="Cargando tablero y seguimiento de fases..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Park Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-2 py-0.5 rounded">
              Tablero de Mando
            </span>
            <span className="text-xs text-slate-500">Supervisión integral de apertura</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {activePark?.name || 'Parque Cooper'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-calm-600 flex-shrink-0" />
            <span>{activePark?.location || 'Ensenada, B.C.'}</span>
          </p>
        </div>

        {parks.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <label htmlFor="park-select" className="text-xs font-semibold text-slate-600">
              Cambiar Parque:
            </label>
            <select
              id="park-select"
              value={selectedParkId}
              onChange={(e) => setSelectedParkId(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium"
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

      {/* "Listo para abrir" Locked Status Hero Banner */}
      <div
        className={`rounded-2xl border p-6 transition-all shadow-soft-lg ${
          isReadyToOpen
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-300 text-emerald-950'
            : 'bg-white border-amber-300/80 text-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isReadyToOpen
                  ? 'bg-emerald-600 text-white shadow-soft'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isReadyToOpen ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isReadyToOpen
                      ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                      : 'bg-amber-200 text-amber-950 border border-amber-400'
                  }`}
                >
                  {isReadyToOpen ? 'Listo para abrir' : 'Apertura Bloqueada'}
                </span>
                <span className="text-xs text-slate-500">
                  {validatedCount} de {totalReqCount} requisitos validados oficialmente
                </span>
              </div>

              <h2 className="text-xl font-bold">
                {isReadyToOpen
                  ? '¡El parque cuenta con el 100% de requisitos dictaminados y validados!'
                  : 'Estatus: En adecuación progresiva (Bloqueado para apertura)'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {isReadyToOpen
                  ? 'Todos los permisos de gobierno, adecuaciones de infraestructura por área y señalética comunitaria han sido aprobados por sus respectivos comités de educación, psicología y finanzas.'
                  : `Por seguridad de la comunidad neurodivergente, el parque permanece bloqueado para apertura al público. Faltan ${
                      totalReqCount - validatedCount
                    } requisitos por validar con dictamen oficial.`}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto flex-shrink-0">
            {isReadyToOpen ? (
              <Button
                variant="primary"
                onClick={handleOpenPark}
                disabled={activePark?.status === 'open' || !isAdmin}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {activePark?.status === 'open'
                  ? '✓ Parque Inaugurado Oficialmente'
                  : 'Habilitar Apertura Oficial'}
              </Button>
            ) : (
              <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-xl max-w-xs">
                <p className="font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Regla de seguridad:
                </p>
                <p className="mt-0.5 opacity-90">
                  Este candado se desbloqueará automáticamente al dictaminar y validar los {totalReqCount}{' '}
                  requisitos.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/60">
          <ProgressBar
            value={totalReqCount > 0 ? (validatedCount / totalReqCount) * 100 : 0}
            label="Avance Global de Validación de Requisitos"
            subLabel={`${validatedCount} validados de ${totalReqCount} totales`}
            size="lg"
            colorScheme={isReadyToOpen ? 'emerald' : 'calm'}
          />
        </div>
      </div>

      {/* Progress Cards Per Phase (Data-Driven) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-800">Avance por Fase de Adecuación</h2>
          <span className="text-xs text-slate-500">Orden secuencial de cumplimiento</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            const Icon = phase.code === 'phase-1' ? FileCheck2 : phase.code === 'phase-2' ? Sliders : Signpost;

            return (
              <div
                key={phase.id}
                className="card-calm p-5 flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-calm-100 text-calm-800 flex items-center justify-center font-bold text-xs">
                      {phase.order}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{percent}% validado</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{phase.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{phase.description}</p>
                  </div>

                  <ProgressBar value={percent} size="sm" showPercentage={false} />

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="bg-emerald-50 text-emerald-900 p-2 rounded-lg border border-emerald-200">
                      <span className="block font-bold text-sm">{valid}</span>
                      <span className="text-[10px] uppercase font-semibold">Validados</span>
                    </div>
                    <div className="bg-teal-50 text-teal-900 p-2 rounded-lg border border-teal-200">
                      <span className="block font-bold text-sm">{comp}</span>
                      <span className="text-[10px] uppercase font-semibold">Completos</span>
                    </div>
                    <div className="bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-200">
                      <span className="block font-bold text-sm">{pend}</span>
                      <span className="text-[10px] uppercase font-semibold">Pendientes</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/parks/${selectedParkId}/${phase.code}`}
                  className="inline-flex items-center justify-between text-xs font-semibold text-calm-700 hover:text-calm-900 pt-3 border-t border-slate-100 group"
                >
                  <span>Ver checklist de la {phase.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Pending Items To Review & Community / Schedules Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Items List (2 columns) */}
        <div className="lg:col-span-2 card-calm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Requisitos Pendientes de Dictamen o Validación</span>
              </h2>
              <p className="text-xs text-slate-500">
                Lista prioritaria de elementos que requieren atención del comité
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {totalReqCount - validatedCount} pendientes
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
                        <span className="text-[10px] font-semibold text-calm-700 bg-calm-50 px-1.5 py-0.5 rounded">
                          {phase?.name || req.phaseCode}
                        </span>
                        {req.specialty && <Badge specialty={req.specialty} size="sm" />}
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{req.title}</p>
                      {pr.notes && <p className="text-xs text-slate-500 italic">"{pr.notes}"</p>}
                    </div>

                    <Link
                      to={`/parks/${selectedParkId}/${req.phaseCode}`}
                      className="text-xs text-calm-700 hover:text-calm-900 font-semibold flex items-center gap-1 flex-shrink-0 pt-1"
                    >
                      <span>Revisar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}

            {totalReqCount - validatedCount === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                🎉 No hay requisitos pendientes. Todos han sido validados con éxito.
              </div>
            )}
          </div>
        </div>

        {/* Quick widgets (1 column) */}
        <div className="space-y-4">
          {/* Schedules Widget */}
          <div className="card-calm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-calm-600" />
                <span>Horarios Especiales Activos</span>
              </h3>
              <Link
                to={`/parks/${selectedParkId}/schedules`}
                className="text-xs text-calm-700 hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <div className="space-y-2">
              {schedules.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{s.days.join(', ')}</span>
                    <span className="text-calm-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {s.startTime} - {s.endTime}
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-1 text-[11px]">
                    {s.restrictions[0] || 'Ambiente controlado'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Affiliated Associations Widget */}
          <div className="card-calm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-calm-600" />
                <span>Asociaciones en Red</span>
              </h3>
              <Link to="/associations" className="text-xs text-calm-700 hover:underline">
                Gestionar ({associations.length})
              </Link>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Organizaciones civiles vinculadas para validación de señalética, horarios y réplicas en otros estados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
