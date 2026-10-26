import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { parkApi, phaseApi, requirementApi, userApi } from '../services/api';
import { Park, Phase, Requirement, ParkRequirement, User } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
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
      <div className="w3-container w3-white w3-card w3-padding-32 w3-center w3-margin-top">
        <p>No se encontró el parque solicitado.</p>
        <Link to="/parks" className="w3-button w3-black w3-small w3-margin-top">
          Volver al directorio de parques
        </Link>
      </div>
    );
  }

  const totalReqs = parkRequirements.length;
  const validatedReqs = parkRequirements.filter((pr) => pr.status === 'validated').length;
  const overallPercentage = totalReqs > 0 ? Math.round((validatedReqs / totalReqs) * 100) : 0;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Directorio de Parques', path: '/parks' },
          { label: park.name },
        ]}
      />

      {/* Park Info Hero */}
      <div className="w3-container w3-white w3-card w3-padding-24 w3-margin-bottom w3-leftbar w3-border-black">
        <div className="w3-row">
          <div className="w3-col l8 m12 s12">
            <div style={{ marginBottom: '8px' }}>
              <span className="w3-tag w3-black w3-small" style={{ marginRight: '6px' }}>
                {park.state}
              </span>
              <span
                className={`w3-tag w3-small ${
                  park.status === 'open' ? 'w3-green' : 'w3-khaki'
                }`}
              >
                {park.status === 'open' ? 'Abierto al Público' : 'En Adecuación Progresiva'}
              </span>
            </div>

            <h1 className="w3-xxlarge w3-wide" style={{ margin: '8px 0' }}>{park.name}</h1>
            <p className="w3-text-grey" style={{ margin: '4px 0' }}>
              <i className="fa fa-map-marker w3-margin-right"></i>
              {park.location}
            </p>
            <p style={{ margin: '8px 0 0 0', lineHeight: '1.6' }}>
              {park.description}
            </p>
          </div>

          <div className="w3-col l4 m12 s12 w3-margin-top">
            <div className="w3-container w3-light-grey w3-border w3-padding-16">
              <ProgressBar
                value={overallPercentage}
                label="Validación General"
                subLabel={`${validatedReqs}/${totalReqs}`}
                colorScheme={overallPercentage === 100 ? 'emerald' : 'calm'}
              />
              {park.targetOpenDate && (
                <p className="w3-tiny w3-text-grey" style={{ margin: '8px 0 0 0' }}>
                  <i className="fa fa-calendar w3-margin-right"></i>
                  Meta apertura: {new Date(park.targetOpenDate).toLocaleDateString('es-MX')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Sequential Phases & Assigned Committee Members */}
      <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
        {/* Ordered Data-Driven Phases (8 columns) */}
        <div className="w3-col l8 m12 s12 w3-margin-bottom">
          <h2 className="w3-large w3-wide w3-margin-bottom">FASES DE ADECUACIÓN Y VERIFICACIÓN</h2>

          <div>
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

              return (
                <div
                  key={phase.id}
                  className="w3-card w3-white w3-container w3-padding-16 w3-margin-bottom"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="w3-tag w3-black w3-large font-bold" style={{ padding: '6px 12px' }}>
                        {phase.order}
                      </span>
                      <div>
                        <h3 className="w3-medium w3-wide" style={{ margin: 0 }}>{phase.name}</h3>
                        <p className="w3-small w3-text-grey" style={{ margin: 0 }}>
                          {phase.description}
                        </p>
                      </div>
                    </div>

                    <span className="w3-tag w3-light-grey w3-border w3-small">
                      {validated} / {total} validados
                    </span>
                  </div>

                  <div style={{ margin: '14px 0 8px 0' }}>
                    <ProgressBar value={percent} size="sm" showPercentage={false} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                    <span className="w3-tiny w3-text-grey">
                      {completed} en espera de dictamen • {pending} pendientes
                    </span>

                    <Link
                      to={`/parks/${park.id}/${phase.code}`}
                      className="w3-button w3-black w3-small"
                      style={{ padding: '4px 10px' }}
                    >
                      ABRIR MÓDULO <i className="fa fa-arrow-right w3-margin-left"></i>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Responsible People / Committee Members (4 columns) */}
        <div className="w3-col l4 m12 s12 w3-margin-bottom">
          <div className="w3-card w3-white w3-container w3-padding-16">
            <h3 className="w3-medium w3-wide" style={{ margin: '0 0 4px 0' }}>
              <i className="fa fa-users w3-margin-right"></i>
              COMITÉ RESPONSABLE
            </h3>
            <p className="w3-small w3-text-grey" style={{ margin: '0 0 12px 0' }}>
              Especialistas asignados al seguimiento técnico
            </p>

            <div>
              {assignedUsers.map((user) => (
                <div
                  key={user.id}
                  className="w3-panel w3-light-grey w3-border w3-padding-small w3-margin-bottom"
                >
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{user.name}</p>
                  <p className="w3-small w3-text-grey" style={{ margin: '2px 0' }}>{user.institution}</p>
                  <div style={{ marginTop: '4px' }}>
                    <Badge role={user.role} size="sm" />
                    {user.specialty && (
                      <span style={{ marginLeft: '4px' }}>
                        <Badge specialty={user.specialty} size="sm" />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {assignedUsers.length === 0 && (
                <p className="w3-small w3-text-grey">No hay especialistas asignados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
