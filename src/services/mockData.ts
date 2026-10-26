import {
  User,
  Park,
  Phase,
  Requirement,
  ParkRequirement,
  Area,
  NeurodivergenceCategory,
  Infrastructure,
  AreaCategoryInfrastructure,
  Association,
  ParkSchedule,
  ChecklistTemplate,
} from '../types';

export const SEED_USERS: User[] = [
  // 2 Admins
  {
    id: 'user-admin-1',
    name: 'Ing. Laura Valenzuela',
    email: 'admin@neuroparque.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '646-120-4567',
    institution: 'Dirección de Obras y Parques Públicos',
  },
  {
    id: 'user-admin-2',
    name: 'Arq. Roberto Méndez',
    email: 'gestor@neuroparque.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '646-155-8890',
    institution: 'Secretaría de Infraestructura y Desarrollo Urbano',
  },
  // Committee (representing education, psychology, finance)
  {
    id: 'user-committee-edu',
    name: 'Mtra. Elena Gómez (Educación)',
    email: 'educacion@neuroparque.org',
    role: 'committee',
    specialty: 'education',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '646-211-3412',
    institution: 'Facultad de Pedagogía y Educación Especial UABC',
  },
  {
    id: 'user-committee-psy',
    name: 'Dra. Carmen Solís (Psicología)',
    email: 'psicologia@neuroparque.org',
    role: 'committee',
    specialty: 'psychology',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '646-300-8812',
    institution: 'Colegio de Psicólogos de Ensenada',
  },
  {
    id: 'user-committee-fin',
    name: 'Lic. Manuel Estrada (Finanzas)',
    email: 'finanzas@neuroparque.org',
    role: 'committee',
    specialty: 'finance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '646-412-9900',
    institution: 'Tesorería y Administración de Fondos para Inclusión',
  },
  // 2 Viewers
  {
    id: 'user-viewer-1',
    name: 'Sofía Navarro (Observadora Ciudadana)',
    email: 'observador1@neuroparque.org',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '646-555-1234',
    institution: 'Asociación de Familias Neurodiversas',
  },
  {
    id: 'user-viewer-2',
    name: 'Carlos Morales (Auditor Externo)',
    email: 'observador2@neuroparque.org',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '646-555-5678',
    institution: 'Comisión de Transparencia Ciudadana',
  },
];

export const SEED_PHASES: Phase[] = [
  {
    id: 'phase-1',
    code: 'phase-1',
    order: 1,
    name: 'Fase 1: Lineamientos y permisos',
    description: 'Acreditación de permisos de gobierno, lineamientos normativos y dictámenes de viabilidad.',
    isDefault: true,
  },
  {
    id: 'phase-2',
    code: 'phase-2',
    order: 2,
    name: 'Fase 2: Infraestructura y equipamiento',
    description: 'Adecuación física, aparatos especializados y especificaciones cromáticas por área y categoría.',
    isDefault: true,
  },
  {
    id: 'phase-3',
    code: 'phase-3',
    order: 3,
    name: 'Fase 3: Señalética y comunidad',
    description: 'Señalización accesible, pictogramas y señalética de emergencia acordada con la comunidad.',
    isDefault: true,
  },
];

export const SEED_PARKS: Park[] = [
  {
    id: 'park-ensenada-cooper',
    name: 'Parque Cooper',
    state: 'Baja California',
    location: 'Ensenada, B.C. (Zona Centro - Calle Tercera y Ryerson)',
    description: 'Primer parque regular preexistente en el estado adaptado integralmente para personas neurodivergentes.',
    status: 'in_progress',
    contactPerson: 'Mtra. Elena Gómez',
    phone: '646-211-3412',
    email: 'parque.cooper@ensenada.gob.mx',
    assignedUserIds: [
      'user-admin-1',
      'user-committee-edu',
      'user-committee-psy',
      'user-committee-fin',
    ],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-10-20T12:00:00Z',
    targetOpenDate: '2026-12-15',
  },
];

// Placeholder requirements (client did not define exact texts)
export const SEED_REQUIREMENTS: Requirement[] = [
  // Phase 1 - Permits
  {
    id: 'req-101',
    phaseCode: 'phase-1',
    title: 'Requisito de ejemplo 1.1: Permiso de uso de suelo y regularización municipal',
    description: 'Documentación que avala el predio y la modificación de espacio recreativo emitida por el Ayuntamiento.',
    specialty: 'general',
    categoryType: 'permits',
    isExample: true,
  },
  {
    id: 'req-102',
    phaseCode: 'phase-1',
    title: 'Requisito de ejemplo 1.2: Dictamen de Protección Civil y protocolo de evacuación sensorial',
    description: 'Inspección oficial de rutas de evacuación libres de obstáculos y zonas de repliegue seguras.',
    specialty: 'education',
    categoryType: 'permits',
    isExample: true,
  },
  {
    id: 'req-103',
    phaseCode: 'phase-1',
    title: 'Requisito de ejemplo 1.3: Validación de presupuesto y partida financiera para adecuación',
    description: 'Revisión y dictamen de asignación presupuestal para el mantenimiento y compra de insumos de inclusión.',
    specialty: 'finance',
    categoryType: 'permits',
    isExample: true,
  },
  {
    id: 'req-104',
    phaseCode: 'phase-1',
    title: 'Requisito de ejemplo 1.4: Licencia sanitaria y de accesibilidad universal estatal',
    description: 'Revisión de apego a la Ley de Inclusión y Desarrollo de Personas con Discapacidad del Estado.',
    specialty: 'psychology',
    categoryType: 'permits',
    isExample: true,
  },

  // Phase 2 - General Phase 2 Requirements
  {
    id: 'req-201',
    phaseCode: 'phase-2',
    title: 'Requisito de ejemplo 2.1: Certificación de colores mate no saturados en juegos',
    description: 'Verificación fotográfica y física de que toda la estructura de juegos fue repintada con la paleta suave aprobada.',
    specialty: 'psychology',
    categoryType: 'infrastructure',
    isExample: true,
  },
  {
    id: 'req-202',
    phaseCode: 'phase-2',
    title: 'Requisito de ejemplo 2.2: Instalación de columpios y módulos de contención y equilibrio',
    description: 'Instalación de aparatos biomecánicos con certificación de seguridad para estimulación vestibular controlada.',
    specialty: 'education',
    categoryType: 'infrastructure',
    isExample: true,
  },
  {
    id: 'req-203',
    phaseCode: 'phase-2',
    title: 'Requisito de ejemplo 2.3: Supervisión financiera de obra y compras de equipamiento',
    description: 'Comprobación de erogación de recursos y facturas cotejadas contra los aparatos instalados en campo.',
    specialty: 'finance',
    categoryType: 'infrastructure',
    isExample: true,
  },

  // Phase 3 - Signage & Community
  {
    id: 'req-301',
    phaseCode: 'phase-3',
    title: 'Requisito de ejemplo 3.1: Señalética de emergencia adaptada para neurodivergencias',
    description: 'Instalación de letreros luminiscentes suaves con pictogramas validados que guían a la zona de calma en crisis.',
    specialty: 'psychology',
    categoryType: 'signage',
    isExample: true,
  },
  {
    id: 'req-302',
    phaseCode: 'phase-3',
    title: 'Requisito de ejemplo 3.2: Mapa táctil y paneles de anticipación en el acceso principal',
    description: 'Tableros físicos al inicio del parque con el mapa del recorrido e identificación visual de niveles de estímulo.',
    specialty: 'education',
    categoryType: 'signage',
    isExample: true,
  },
  {
    id: 'req-303',
    phaseCode: 'phase-3',
    title: 'Requisito de ejemplo 3.3: Acuerdos comunitarios y validación con asociaciones locales',
    description: 'Minutas de asamblea con vecinos y fundaciones que aprueban los horarios especiales y normas de convivencia.',
    specialty: 'general',
    categoryType: 'signage',
    isExample: true,
  },
];

// Initial status of requirements for Parque Cooper
export const SEED_PARK_REQUIREMENTS: ParkRequirement[] = [
  {
    id: 'preq-101',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-101',
    status: 'validated',
    validatedBy: 'user-admin-1',
    validatedByName: 'Ing. Laura Valenzuela',
    validatedAt: '2026-10-05T14:30:00Z',
    notes: 'Permiso municipal #ENS-2026-089 expedido y en archivo físico.',
    evidence: [
      {
        id: 'ev-1',
        type: 'after',
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        caption: 'Dictamen de uso de suelo sellado por el municipio',
        uploadedAt: '2026-10-05T11:00:00Z',
        uploadedBy: 'Ing. Laura Valenzuela',
      },
    ],
  },
  {
    id: 'preq-102',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-102',
    status: 'completed',
    notes: 'Inspección realizada favorablemente. Falta firma final del comité de educación.',
    evidence: [],
  },
  {
    id: 'preq-103',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-103',
    status: 'validated',
    validatedBy: 'user-committee-fin',
    validatedByName: 'Lic. Manuel Estrada (Finanzas)',
    validatedAt: '2026-10-12T09:15:00Z',
    notes: 'Partida financiera asignada y aprobada para el ejercicio fiscal 2026.',
    evidence: [],
  },
  {
    id: 'preq-104',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-104',
    status: 'in_progress',
    notes: 'En revisión ante la Secretaría de Salud y Bienestar de Baja California.',
    evidence: [],
  },
  {
    id: 'preq-201',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-201',
    status: 'completed',
    notes: 'Se aplicó pintura verde salvia y beige mate en módulo de resbaladillas.',
    evidence: [
      {
        id: 'ev-201-before',
        type: 'before',
        url: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=600&auto=format&fit=crop&q=80',
        caption: 'Estado anterior: colores primarios brillantes y saturados con reflejo solar intenso',
        uploadedAt: '2026-09-15T10:00:00Z',
        uploadedBy: 'Arq. Roberto Méndez',
      },
      {
        id: 'ev-201-after',
        type: 'after',
        url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80',
        caption: 'Estado nuevo: acabado mate no reflejante en tonos salvia y tierra suave',
        uploadedAt: '2026-10-18T16:20:00Z',
        uploadedBy: 'Arq. Roberto Méndez',
      },
    ],
  },
  {
    id: 'preq-202',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-202',
    status: 'in_progress',
    notes: 'Estructuras recibidas en almacén, montaje programado para esta semana.',
    evidence: [],
  },
  {
    id: 'preq-203',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-203',
    status: 'pending',
    notes: 'Pendiente conciliar recibos de la constructora asignada.',
    evidence: [],
  },
  {
    id: 'preq-301',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-301',
    status: 'in_progress',
    notes: 'Diseño de pictogramas consensuado con especialistas de psicología.',
    evidence: [],
  },
  {
    id: 'preq-302',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-302',
    status: 'pending',
    notes: 'Cotizaciones en proceso para el panel háptico en braille y alto relieve.',
    evidence: [],
  },
  {
    id: 'preq-303',
    parkId: 'park-ensenada-cooper',
    requirementId: 'req-303',
    status: 'completed',
    notes: 'Reunión comunitaria celebrada con 42 familias y vecinos de la zona.',
    evidence: [],
  },
];

// Areas of Parque Cooper (Admin editable)
export const SEED_AREAS: Area[] = [
  {
    id: 'area-1',
    parkId: 'park-ensenada-cooper',
    name: 'Área de Juegos Sensoriales',
    description: 'Zona de juegos motrices con estimulación vestibular y propioceptiva gradual.',
  },
  {
    id: 'area-2',
    parkId: 'park-ensenada-cooper',
    name: 'Área de Calma y Regulación',
    description: 'Espacio de baja estimulación para descompresión sensorial y respiro familiar.',
  },
  {
    id: 'area-3',
    parkId: 'park-ensenada-cooper',
    name: 'Zona de Caminadores y Árboles',
    description: 'Senderos con textura táctil diferenciada y sombras naturales.',
  },
  {
    id: 'area-4',
    parkId: 'park-ensenada-cooper',
    name: 'Módulo de Servicios y Baños Inclusivos',
    description: 'Instalaciones sanitarias con señalización en pictogramas y secadores silenciosos.',
  },
];

// Placeholder neurodivergence categories (clearly labeled placeholders per seed data rules)
export const SEED_CATEGORIES: NeurodivergenceCategory[] = [
  {
    id: 'cat-1',
    name: 'Categoría de ejemplo 1 (Sensibilidad vestibular y cinestésica)',
    description: 'Requisitos de movimiento controlado, balanceo suave y seguridad física para balance.',
    isExample: true,
  },
  {
    id: 'cat-2',
    name: 'Categoría de ejemplo 2 (Híper-reactividad auditiva y visual)',
    description: 'Requisitos de absorción sonora, iluminación cálida difusa y colores mate desaturados.',
    isExample: true,
  },
  {
    id: 'cat-3',
    name: 'Categoría de ejemplo 3 (Orientación espacial y anticipación)',
    description: 'Requisitos de señalización con pictogramas unificados, trayectorias continuas y zonas delimitadas.',
    isExample: true,
  },
];

// Infrastructures & equipment
export const SEED_INFRASTRUCTURES: Infrastructure[] = [
  {
    id: 'inf-1',
    name: 'Pintura mate bajo estímulo (#5A8270 Verde Salvia Calmo)',
    type: 'color_spec',
    colorOrSpec: '#5A8270 - Acabado mate no reflectante',
    description: 'Sustitución de colores primarios brillantes por tonalidades naturales y tranquilizantes.',
  },
  {
    id: 'inf-2',
    name: 'Columpio tipo canasta ergonómica de contención',
    type: 'equipment',
    colorOrSpec: 'Estructura metálica termoesmaltada y textil suave',
    description: 'Columpio con soporte lumbar y arnés para balanceo seguro y contención corporal.',
  },
  {
    id: 'inf-3',
    name: 'Cubículo vegetal o estructura de descompresión sensorial',
    type: 'infrastructure',
    colorOrSpec: 'Madera tratada y arbustos amortiguadores de sonido',
    description: 'Refugio de baja iluminación con capacidad para 1 o 2 personas en momentos de crisis o sobrecarga.',
  },
  {
    id: 'inf-4',
    name: 'Pavimento amortiguante continuo sin juntas táctiles',
    type: 'infrastructure',
    colorOrSpec: 'Caucho EPDM continuo 40mm color arena (#D2B48C)',
    description: 'Superficie suave y segura para evitar caídas y reducir el ruido de pisadas.',
  },
  {
    id: 'inf-5',
    name: 'Paneles de estimulación táctil con texturas naturales',
    type: 'equipment',
    colorOrSpec: 'Maderas, piedras pulidas y resinas no tóxicas',
    description: 'Módulos interactivos a diferentes alturas para autorregulación por el tacto.',
  },
];

// Area x Category Matrix linkages
export const SEED_AREA_CATEGORY_INFRASTRUCTURE: AreaCategoryInfrastructure[] = [
  {
    id: 'aci-1',
    parkId: 'park-ensenada-cooper',
    areaId: 'area-1',
    categoryId: 'cat-1',
    infrastructureId: 'inf-2', // Columpio canasta
    isCompleted: true,
    isValidated: true,
    validatedBy: 'user-committee-edu',
    validatedByName: 'Mtra. Elena Gómez (Educación)',
    validatedAt: '2026-10-14T11:20:00Z',
    notes: 'Columpio instalado y probado mecánicamente. Balanceo verificado.',
    beforePhoto: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=600&auto=format&fit=crop&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'aci-2',
    parkId: 'park-ensenada-cooper',
    areaId: 'area-1',
    categoryId: 'cat-2',
    infrastructureId: 'inf-1', // Pintura mate salvia
    isCompleted: true,
    isValidated: true,
    validatedBy: 'user-committee-psy',
    validatedByName: 'Dra. Carmen Solís (Psicología)',
    validatedAt: '2026-10-17T15:40:00Z',
    notes: 'Se cubrió la pintura amarilla reflectante original. El contraste visual es suave.',
    beforePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?w=600&auto=format&fit=crop&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'aci-3',
    parkId: 'park-ensenada-cooper',
    areaId: 'area-2',
    categoryId: 'cat-2',
    infrastructureId: 'inf-3', // Cubículo sensorial
    isCompleted: true,
    isValidated: false,
    notes: 'Estructura lista; se espera visita del comité de psicología para corroborar nivel sonoro.',
    beforePhoto: '',
    afterPhoto: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'aci-4',
    parkId: 'park-ensenada-cooper',
    areaId: 'area-2',
    categoryId: 'cat-3',
    infrastructureId: 'inf-1', // Color suave
    isCompleted: true,
    isValidated: true,
    validatedBy: 'user-admin-1',
    validatedByName: 'Ing. Laura Valenzuela',
    validatedAt: '2026-10-19T09:00:00Z',
    notes: 'Pintura en zona de calma concluida.',
  },
  {
    id: 'aci-5',
    parkId: 'park-ensenada-cooper',
    areaId: 'area-3',
    categoryId: 'cat-1',
    infrastructureId: 'inf-4', // Pavimento amortiguante
    isCompleted: false,
    isValidated: false,
    notes: 'Fase de nivelación de terreno en progreso.',
  },
  {
    id: 'aci-6',
    parkId: 'park-ensenada-cooper',
    areaId: 'area-4',
    categoryId: 'cat-3',
    infrastructureId: 'inf-5', // Paneles táctiles
    isCompleted: false,
    isValidated: false,
    notes: 'Pendiente de entrega por el proveedor especializado.',
  },
];

// Special schedules for Parque Cooper
export const SEED_SCHEDULES: ParkSchedule[] = [
  {
    id: 'sched-1',
    parkId: 'park-ensenada-cooper',
    days: ['Martes', 'Jueves'],
    startTime: '08:00',
    endTime: '11:00',
    restrictions: [
      'Prohibido el ingreso de perros y mascotas',
      'Entorno sonoro controlado (sin música, altavoces ni silbatos)',
      'Sin labores de poda, soplado ni maquinaria',
      'Acceso vehicular restringido en perímetro cercano',
      'Personal de vigilancia con capacitación en neurodiversidad',
    ],
    active: true,
    notes: 'Horario matutino preferencial con menor afluencia urbana.',
  },
  {
    id: 'sched-2',
    parkId: 'park-ensenada-cooper',
    days: ['Sábado'],
    startTime: '15:30',
    endTime: '18:00',
    restrictions: [
      'Sin perros ni mascotas no de servicio',
      'Iluminación solar indirecta / sin reflectores intermitentes',
      'Zonas de calma exclusivas para familias y personas registradas',
      'Silencio relativo y juegos guiados con bajo estímulo',
    ],
    active: true,
    notes: 'Horario vespertino familiar de fin de semana.',
  },
];

// Affiliated Associations (Full CRUD, marked as examples)
export const SEED_ASSOCIATIONS: Association[] = [
  {
    id: 'assoc-1',
    name: 'Asociación de ejemplo 1: Red Sonorense y Peninsular de Autismo',
    contactPerson: 'Lic. Mariana Cárdenas',
    scope: 'estatal',
    email: 'contacto@redautismobc.org',
    phone: '646-178-9901',
    address: 'Av. Ruiz #450, Zona Centro, Ensenada, B.C.',
    state: 'Baja California',
    website: 'https://redautismobc.org',
    notes: 'Asesoría en diseño de pictogramas y protocolos de auxilio para el Parque Cooper.',
    isExample: true,
  },
  {
    id: 'assoc-2',
    name: 'Asociación de ejemplo 2: Fundación Inclusión Viva A.C.',
    contactPerson: 'Dr. Alejandro Treviño',
    scope: 'nacional',
    email: 'info@fundacioninclusionviva.mx',
    phone: '55-5620-3300',
    address: 'Paseo de la Reforma 222, CDMX',
    state: 'Nacional',
    website: 'https://fundacioninclusionviva.mx',
    notes: 'Respaldo institucional y vínculo con programas de financiamiento para espacios públicos accesibles.',
    isExample: true,
  },
  {
    id: 'assoc-3',
    name: 'Asociación de ejemplo 3: Colectivo Familias TDAH y Sensorial Ensenada',
    contactPerson: 'Sra. Beatriz Lozano',
    scope: 'local',
    email: 'familiastdahensenada@gmail.com',
    phone: '646-233-4411',
    address: 'Fracc. Valle Dorado, Ensenada, B.C.',
    state: 'Baja California',
    website: '',
    notes: 'Representantes de las familias usuarias que participan en las pruebas de horario especial.',
    isExample: true,
  },
  {
    id: 'assoc-4',
    name: 'Asociación de ejemplo 4: Alianza Iberoamericana de Espacios Neuro-inclusivos',
    contactPerson: 'Mtro. Javier Santos',
    scope: 'internacional',
    email: 'contacto@alianzaneuro.org',
    phone: '+34-91-456-7890',
    address: 'Madrid, España / Red Regional Latinoamérica',
    state: 'Internacional',
    website: 'https://alianzaneuro.org',
    notes: 'Intercambio de guías técnicas y modelos de replicabilidad para parques en México y Latinoamérica.',
    isExample: true,
  },
];

// Templates for cloning & replication across other states (e.g., Sonora/Hermosillo, Baja California)
export const SEED_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'tpl-baja-california',
    name: 'Plantilla Estándar Baja California (3 Fases)',
    state: 'Baja California',
    description: 'Plantilla oficial basada en la normativa estatal de B.C. y el piloto del Parque Cooper Ensenada.',
    createdAt: '2026-09-01T00:00:00Z',
    phases: [
      {
        order: 1,
        code: 'phase-1',
        name: 'Fase 1: Lineamientos y permisos',
        requirements: [
          {
            title: 'Permiso municipal de adaptación de parque público',
            description: 'Autorización oficial del Cabildo y Dirección de Obras Públicas.',
            specialty: 'general',
            isExample: true,
          },
          {
            title: 'Protocolo de evacuación y seguridad ante emergencias',
            description: 'Aprobación de la coordinación estatal de Protección Civil.',
            specialty: 'education',
            isExample: true,
          },
          {
            title: 'Suficiencia presupuestaria de obra y mantenimiento continuo',
            description: 'Dictamen de viabilidad financiera del comité.',
            specialty: 'finance',
            isExample: true,
          },
        ],
      },
      {
        order: 2,
        code: 'phase-2',
        name: 'Fase 2: Infraestructura y equipamiento',
        requirements: [
          {
            title: 'Readecuación cromática con acabados mate de bajo estímulo',
            description: 'Pintado de estructuras metálicas y muros con paleta no saturada.',
            specialty: 'psychology',
            isExample: true,
          },
          {
            title: 'Instalación de zona de descompresión sensorial',
            description: 'Módulo aislado acústicamente con vegetación amortiguadora.',
            specialty: 'psychology',
            isExample: true,
          },
          {
            title: 'Supervisión de compras y garantías de equipamiento inclusivo',
            description: 'Revisión y auditoría de egresos conforme a la partida autorizada.',
            specialty: 'finance',
            isExample: true,
          },
        ],
      },
      {
        order: 3,
        code: 'phase-3',
        name: 'Fase 3: Señalética y comunidad',
        requirements: [
          {
            title: 'Señalización de emergencia con pictogramas claros',
            description: 'Identificación accesible de salidas, punto de calma y auxilio.',
            specialty: 'psychology',
            isExample: true,
          },
          {
            title: 'Mapa háptico y paneles de anticipación',
            description: 'Instalación de paneles informativos en acceso principal.',
            specialty: 'education',
            isExample: true,
          },
          {
            title: 'Aprobación de reglamento de convivencia con asociaciones aliadas',
            description: 'Firma de convenio para horarios especiales sin mascotas ni ruido.',
            specialty: 'general',
            isExample: true,
          },
        ],
      },
    ],
  },
  {
    id: 'tpl-sonora-hermosillo',
    name: 'Plantilla Sonora / Hermosillo (Parque desde cero)',
    state: 'Sonora',
    description: 'Plantilla adaptada para la creación de un parque neurodivergente nuevo desde terreno virgen.',
    createdAt: '2026-10-01T00:00:00Z',
    phases: [
      {
        order: 1,
        code: 'phase-1',
        name: 'Fase 1: Lineamientos y permisos estatales de Sonora',
        requirements: [
          {
            title: 'Estudio de impacto ambiental y licencias de construcción nuevas',
            description: 'Permisos conforme a la Ley de Desarrollo Urbano del Estado de Sonora.',
            specialty: 'general',
            isExample: true,
          },
          {
            title: 'Dictamen de protección civil y diseño bioclimático para calor extremo',
            description: 'Zonas techadas con sombra térmica para evitar golpes de calor sensoriales.',
            specialty: 'education',
            isExample: true,
          },
          {
            title: 'Fondo de inversión inicial y coinversión municipal-estatal',
            description: 'Validación de estructura de costos por el área financiera.',
            specialty: 'finance',
            isExample: true,
          },
        ],
      },
      {
        order: 2,
        code: 'phase-2',
        name: 'Fase 2: Infraestructura y equipamiento inicial',
        requirements: [
          {
            title: 'Construcción de zonas de estimulación y descanso térmico',
            description: 'Áreas de juego sensorial bajo sombra vegetal.',
            specialty: 'psychology',
            isExample: true,
          },
        ],
      },
      {
        order: 3,
        code: 'phase-3',
        name: 'Fase 3: Señalética bilingüe y pictogramas',
        requirements: [
          {
            title: 'Señalética inclusiva y acuerdos con fundaciones de Hermosillo',
            description: 'Reglamento y señalética coordinada con DIF Sonora.',
            specialty: 'education',
            isExample: true,
          },
        ],
      },
    ],
  },
];
