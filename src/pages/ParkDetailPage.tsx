import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { parkApi, phaseApi, requirementApi, userApi } from '../services/api';
import { Park, Phase, Requirement, ParkRequirement, User } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  MapPin,
  Calendar,
  UserCheck,
  ArrowRight,
  FileCheck2,
  Sliders,
  Signpost,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ParkDetailPage: React.FC = () => {
  const { parkId = 'park-ensenada-cooper' } = useParams<{ parkId: string }>();

  const [park, setPark] = useState<Park | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [parkRequirements, setParkRequirements] = useState<ParkRequirement[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParkData = async () => {
      setIsLoading(true);
      try {
        const [parkData, phasesData, reqsData, parkReqsData, allUsers] = await Promise.all([
          parkApi.getById(parkId),
          phaseApi.getAll(),
          requirementApi.getAll(),
          requirementApi.getParkRequirements(parkId),
          userApi.getAll(),
        ]);

        setPark(parkData || null);
        setPhases(phasesData);
        setRequirements(reqsData);
        setParkRequirements(parkReqsData);

        if (parkData?.assignedUserIds) {
          const filteredUsers = allUsers.filter((u) => parkData.assignedUserIds.includes(u.id));
          setAssignedUsers(filteredUsers);
        }
      } catch (err) {
        console.error('Error fetching park details', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkData();
  }, [parkId]);

  if (isLoading) {
    return <LoadingSpinner message="Cargando detalles del parque y comités asignados..." />;
  }

  if (!park) {
    return (
      <div className="card-calm p-12 text-center text-slate-500">
        <p>No se encontró el parque solicitado.</p>
        <Link to="/parks" className="text-calm-700 font-medium hover:underline mt-2 inline-block">
          Volver al directorio de parques
        </Link>
      </div>
    );
  }

  const totalReqs = parkRequirements.length;
  const validatedReqs = parkRequirements.filter((pr) => pr.status === 'validated').length;
  const overallPercentage = totalReqs > 0 ? Math.round((validatedReqs / totalReqs) * 100) : 0;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Directorio de Parques', path: '/parks' },
          { label: park.name },
        ]}
      />

      {/* Park Info Hero */}
      <div className="card-calm p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-calm-800 bg-calm-50 border border-calm-200 px-2.5 py-0.5 rounded-full">
                {park.state}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  park.status === 'open'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {park.status === 'open' ? 'Abierto al Público' : 'En Adecuación Progresiva'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{park.name}</h1>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-calm-600" />
              <span>{park.location}</span>
            </p>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed pt-1">
              {park.description}
            </p>
          </div>

          <div className="w-full md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 flex-shrink-0 space-y-3">
            <ProgressBar
              value={overallPercentage}
              label="Validación General"
              subLabel={`${validatedReqs}/${totalReqs}`}
              colorScheme={overallPercentage === 100 ? 'emerald' : 'calm'}
            />
            {park.targetOpenDate && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-200/80">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Meta apertura: {new Date(park.targetOpenDate).toLocaleDateString('es-MX')}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Sequential Phases & Assigned Committee Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ordered Data-Driven Phases (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Fases de Adecuación y Verificación
            </h2>
            <span className="text-xs text-slate-500">Secuencia de cumplimiento</span>
          </div>

          <div className="space-y-3">
            {phases.map((phase) => {
              const phaseReqs = requirements.filter((r) => r.phaseCode === phase.code);
              const phaseReqIds = phaseReqs.map((r) => r.id);
              const phaseParkReqs = parkRequirements.filter((pr) =>
                phaseReqIds.includes(pr.requirementId)
              );

              const total = phaseParkReqs.length;
              const validated = phaseParkReqs.filter((p) => p.status === 'validated').length;
              const completed = phaseParkReqs.filter((p) => p.status === 'completed').length;
              const pending = total - validated;
              const percent = total > 0 ? Math.round((validated / total) * 100) : 0;

              const Icon = phase.code === 'phase-1' ? FileCheck2 : phase.code === 'phase-2' ? Sliders : Signpost;

              return (
                <article
                  key={phase.id}
                  aria-label={phase.name}
                  className="card-calm p-5 hover:border-calm-400 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-calm-100 text-calm-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {phase.order}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">{phase.name}</h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {phase.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 flex-shrink-0">
                      {validated} / {total} validados
                    </span>
                  </div>

                  <ProgressBar value={percent} size="sm" showPercentage={false} />

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500">
                      {completed} en espera de dictamen • {pending} pendientes
                    </span>

                    <Link
                      to={`/parks/${park.id}/${phase.code}`}
                      className="text-calm-700 hover:text-calm-900 font-semibold inline-flex items-center gap-1 group"
                    >
                      <span>Abrir módulo de fase</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Responsible People / Committee Members (1 column) */}
        <div className="card-calm p-6 space-y-4 h-fit">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-calm-600" />
              <span>Comité y Personas Responsables</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Especialistas asignados al seguimiento técnico de este parque
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {assignedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-slate-500 truncate">{user.institution}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge role={user.role} size="sm" />
                    {user.specialty && <Badge specialty={user.specialty} size="sm" />}
                  </div>
                </div>
              </div>
            ))}

            {assignedUsers.length === 0 && (
              <p className="text-xs text-slate-400 italic">No hay especialistas asignados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
