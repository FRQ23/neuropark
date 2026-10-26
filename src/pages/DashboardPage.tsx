import React, { useState, useEffect } from 'react';
import { parkApi, phaseApi, requirementApi, scheduleApi, associationApi } from '../services/api';
import { Park, Phase, Requirement, ParkRequirement, ParkSchedule, Association } from '../types';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
    <div className="w3-container" style={{ padding: 0 }}>
      {/* Hero Header */}
      <div className="w3-container w3-white w3-card w3-padding-24 w3-margin-bottom w3-leftbar w3-border-black">
        <div className="w3-row">
          <div className="w3-col l9 m8 s12">
            <div style={{ marginBottom: '8px' }}>
              <span className="w3-tag w3-black w3-small" style={{ marginRight: '6px' }}>
                CASO PILOTO OFICIAL
              </span>
              <span className="w3-tag w3-light-grey w3-small">
                {activePark?.state || 'Baja California'}
              </span>
            </div>

            <h1 className="w3-xxlarge w3-wide" style={{ margin: '8px 0' }}>
              {activePark?.name || 'Parque Cooper'}
            </h1>
            <p className="w3-text-grey" style={{ margin: '4px 0' }}>
              <i className="fa fa-map-marker w3-margin-right"></i>
              {activePark?.location || 'Ensenada, B.C.'}
            </p>
            <p style={{ margin: '8px 0 0 0', lineHeight: '1.6' }}>
              {activePark?.description}
            </p>
          </div>

          {parks.length > 1 && (
            <div className="w3-col l3 m4 s12 w3-margin-top">
              <label htmlFor="park-select" className="w3-text-dark-grey" style={{ display: 'block', marginBottom: '4px' }}>
                <b>CAMBIAR PARQUE:</b>
              </label>
              <select
                id="park-select"
                value={selectedParkId}
                onChange={(e) => setSelectedParkId(e.target.value)}
                className="w3-select w3-border w3-white"
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

      {/* W3.CSS Statistics Bar (Promo Section style from W3.CSS Startup Template) */}
      <div className="w3-row w3-center w3-dark-grey w3-padding-32 w3-margin-bottom">
        <div className="w3-quarter w3-section">
          <span className="w3-xxlarge">
            {totalReqCount > 0 ? Math.round((validatedCount / totalReqCount) * 100) : 0}%
          </span>
          <br />
          <span className="w3-small w3-wide">AVANCE GLOBAL</span>
        </div>
        <div className="w3-quarter w3-section">
          <span className="w3-xxlarge">{validatedCount} / {totalReqCount}</span>
          <br />
          <span className="w3-small w3-wide">REQUISITOS VALIDADOS</span>
        </div>
        <div className="w3-quarter w3-section">
          <span className="w3-xxlarge">{schedules.length}</span>
          <br />
          <span className="w3-small w3-wide">HORARIOS ESPECIALES</span>
        </div>
        <div className="w3-quarter w3-section">
          <span className="w3-xxlarge">{associations.length}</span>
          <br />
          <span className="w3-small w3-wide">FUNDACIONES ALIADAS</span>
        </div>
      </div>

      {/* "Listo para abrir" Status Hero Card */}
      <div
        className={`w3-container w3-card w3-padding-24 w3-margin-bottom w3-leftbar ${
          isReadyToOpen
            ? 'w3-pale-green w3-border-green'
            : 'w3-white w3-border-black'
        }`}
      >
        <div className="w3-row">
          <div className="w3-col l9 m8 s12">
            <div style={{ marginBottom: '8px' }}>
              <span
                className={`w3-tag w3-small ${
                  isReadyToOpen ? 'w3-green' : 'w3-black'
                }`}
                style={{ marginRight: '8px' }}
              >
                <i className={`fa fa-${isReadyToOpen ? 'unlock' : 'lock'} w3-margin-right`}></i>
                {isReadyToOpen ? 'LISTO PARA ABRIR' : 'APERTURA BLOQUEADA'}
              </span>
              <span className="w3-small w3-text-grey font-bold">
                {validatedCount} de {totalReqCount} validados
              </span>
            </div>

            <h2 className="w3-xlarge" style={{ margin: '8px 0' }}>
              {isReadyToOpen
                ? '¡El parque cumple al 100% todos los dictámenes y puede inaugurarse!'
                : 'Estatus: En adecuación progresiva (Bloqueado para apertura)'}
            </h2>

            <p className="w3-text-grey" style={{ lineHeight: '1.6' }}>
              {isReadyToOpen
                ? 'Los comités de educación, psicología y finanzas han dictaminado y acreditado todos los requisitos de infraestructura, pintura y señalética.'
                : `El parque no puede abrir al público hasta que todos los requisitos sean validados. Faltan ${
                    totalReqCount - validatedCount
                  } requisitos por dictaminar.`}
            </p>
          </div>

          <div className="w3-col l3 m4 s12 w3-margin-top w3-right-align">
            {isReadyToOpen ? (
              <button
                type="button"
                onClick={handleOpenPark}
                disabled={activePark?.status === 'open' || !isAdmin}
                className="w3-button w3-black w3-block w3-padding-large w3-large w3-wide"
              >
                {activePark?.status === 'open'
                  ? 'PARQUE INAUGURADO'
                  : 'HABILITAR APERTURA OFICIAL'}
              </button>
            ) : (
              <div className="w3-panel w3-light-grey w3-border w3-padding-16 w3-small w3-left-align">
                <b>REGLA DE APERTURA:</b>
                <p style={{ margin: '4px 0 0 0' }}>
                  El candado permanecerá activo hasta completar la validación técnica en campo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
          <ProgressBar
            value={totalReqCount > 0 ? (validatedCount / totalReqCount) * 100 : 0}
            label="Avance de Validación Oficial"
            subLabel={`${validatedCount} de ${totalReqCount} requisitos`}
            colorScheme={isReadyToOpen ? 'emerald' : 'calm'}
          />
        </div>
      </div>

      {/* Phases Section */}
      <div className="w3-margin-bottom">
        <h2 className="w3-wide w3-margin-bottom">FASES DE ADECUACIÓN</h2>

        <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
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
              <div key={phase.id} className="w3-col l4 m12 s12 w3-margin-bottom">
                <div className="w3-card w3-white w3-container w3-padding-16">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="w3-tag w3-black w3-small">FASE {phase.order}</span>
                    <span className="w3-small font-bold">{percent}% validado</span>
                  </div>

                  <h3 className="w3-large w3-wide" style={{ margin: '12px 0 6px 0' }}>{phase.name}</h3>
                  <p className="w3-small w3-text-grey" style={{ minHeight: '40px', lineHeight: '1.5' }}>
                    {phase.description}
                  </p>

                  <ProgressBar value={percent} size="sm" showPercentage={false} />

                  <div className="w3-row w3-center w3-small w3-margin-top w3-margin-bottom">
                    <div className="w3-third w3-light-grey w3-padding-small w3-border">
                      <b className="w3-block">{valid}</b>
                      <span className="w3-tiny w3-text-grey">Validados</span>
                    </div>
                    <div className="w3-third w3-light-grey w3-padding-small w3-border">
                      <b className="w3-block">{comp}</b>
                      <span className="w3-tiny w3-text-grey">Completos</span>
                    </div>
                    <div className="w3-third w3-light-grey w3-padding-small w3-border">
                      <b className="w3-block">{pend}</b>
                      <span className="w3-tiny w3-text-grey">Pendientes</span>
                    </div>
                  </div>

                  <Link
                    to={`/parks/${selectedParkId}/${phase.code}`}
                    className="w3-button w3-black w3-block w3-small w3-wide"
                  >
                    ABRIR CHECKLIST
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Items & Schedules */}
      <div className="w3-row-padding" style={{ margin: '0 -8px' }}>
        {/* Pending checks list (8 cols) */}
        <div className="w3-col l8 m12 s12 w3-margin-bottom">
          <div className="w3-card w3-white w3-container w3-padding-16">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '12px', marginBottom: '12px' }}>
              <div>
                <h3 className="w3-large w3-wide" style={{ margin: 0 }}>REQUISITOS PENDIENTES DE DICTAMEN</h3>
                <p className="w3-small w3-text-grey" style={{ margin: 0 }}>
                  Elementos pendientes de revisión por los comités
                </p>
              </div>
              <span className="w3-tag w3-black w3-small">
                {totalReqCount - validatedCount} por validar
              </span>
            </div>

            <table className="w3-table w3-striped w3-bordered">
              <tbody>
                {parkRequirements
                  .filter((pr) => pr.status !== 'validated')
                  .slice(0, 6)
                  .map((pr) => {
                    const req = requirements.find((r) => r.id === pr.requirementId);
                    if (!req) return null;
                    const phase = phases.find((p) => p.code === req.phaseCode);

                    return (
                      <tr key={pr.id}>
                        <td style={{ verticalAlign: 'middle', width: '130px' }}>
                          <Badge status={pr.status} size="sm" />
                          <div style={{ marginTop: '4px' }}>
                            <span className="w3-tag w3-light-grey w3-tiny">{phase?.name || req.phaseCode}</span>
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 'bold' }}>{req.title}</div>
                          {pr.notes && (
                            <div className="w3-small w3-text-grey" style={{ fontStyle: 'italic' }}>
                              "{pr.notes}"
                            </div>
                          )}
                        </td>
                        <td style={{ verticalAlign: 'middle', textAlign: 'right', width: '90px' }}>
                          <Link
                            to={`/parks/${selectedParkId}/${req.phaseCode}`}
                            className="w3-button w3-light-grey w3-small"
                          >
                            Revisar
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {totalReqCount - validatedCount === 0 && (
              <div className="w3-container w3-padding-32 w3-center w3-text-grey">
                <i className="fa fa-check-circle w3-xlarge w3-text-green"></i>
                <p>Todos los requisitos han sido validados exitosamente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Schedules quick widget (4 cols) */}
        <div className="w3-col l4 m12 s12 w3-margin-bottom">
          <div className="w3-card w3-white w3-container w3-padding-16">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '12px', marginBottom: '12px' }}>
              <h3 className="w3-large w3-wide" style={{ margin: 0 }}>HORARIOS</h3>
              <Link
                to={`/parks/${selectedParkId}/schedules`}
                className="w3-small w3-button w3-light-grey"
                style={{ padding: '4px 8px' }}
              >
                Ver todos
              </Link>
            </div>

            <div>
              {schedules.map((s) => (
                <div key={s.id} className="w3-panel w3-light-grey w3-border w3-padding-small w3-small" style={{ margin: '8px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{s.days.join(', ')}</span>
                    <span className="w3-tag w3-black w3-tiny">
                      {s.startTime} - {s.endTime}
                    </span>
                  </div>
                  <p className="w3-text-grey" style={{ margin: '4px 0 0 0' }}>
                    {s.restrictions[0] || 'Ambiente controlado'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
