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
  RequirementStatus,
  EvidenceItem,
} from '../types';
import {
  getStoredItem,
  setStoredItem,
  STORAGE_KEYS,
  resetToSeedData,
} from './storage';
import {
  SEED_USERS,
  SEED_PARKS,
  SEED_PHASES,
  SEED_REQUIREMENTS,
  SEED_PARK_REQUIREMENTS,
  SEED_AREAS,
  SEED_CATEGORIES,
  SEED_INFRASTRUCTURES,
  SEED_AREA_CATEGORY_INFRASTRUCTURE,
  SEED_ASSOCIATIONS,
  SEED_SCHEDULES,
  SEED_TEMPLATES,
} from './mockData';

// Simulated network delay for realistic frontend loading states
const delay = (ms = 150): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// USER API
// ==========================================
export const userApi = {
  async getAll(): Promise<User[]> {
    await delay();
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  },

  async getById(id: string): Promise<User | undefined> {
    await delay();
    const users = getStoredItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    return users.find((u) => u.id === id);
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    await delay();
    const users = getStoredItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    };
    users.push(newUser);
    setStoredItem(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    await delay();
    const users = getStoredItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Usuario no encontrado');
    users[index] = { ...users[index], ...updates };
    setStoredItem(STORAGE_KEYS.USERS, users);
    return users[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const users = getStoredItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const filtered = users.filter((u) => u.id !== id);
    setStoredItem(STORAGE_KEYS.USERS, filtered);
  },
};

// ==========================================
// PARK API
// ==========================================
export const parkApi = {
  async getAll(): Promise<Park[]> {
    await delay();
    return getStoredItem<Park[]>(STORAGE_KEYS.PARKS, SEED_PARKS);
  },

  async getById(id: string): Promise<Park | undefined> {
    await delay();
    const parks = getStoredItem<Park[]>(STORAGE_KEYS.PARKS, SEED_PARKS);
    return parks.find((p) => p.id === id);
  },

  async create(parkData: Omit<Park, 'id' | 'createdAt' | 'updatedAt'>): Promise<Park> {
    await delay();
    const parks = getStoredItem<Park[]>(STORAGE_KEYS.PARKS, SEED_PARKS);
    const newPark: Park = {
      ...parkData,
      id: `park-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    parks.push(newPark);
    setStoredItem(STORAGE_KEYS.PARKS, parks);
    return newPark;
  },

  async update(id: string, updates: Partial<Park>): Promise<Park> {
    await delay();
    const parks = getStoredItem<Park[]>(STORAGE_KEYS.PARKS, SEED_PARKS);
    const index = parks.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Parque no encontrado');
    parks[index] = { ...parks[index], ...updates, updatedAt: new Date().toISOString() };
    setStoredItem(STORAGE_KEYS.PARKS, parks);
    return parks[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const parks = getStoredItem<Park[]>(STORAGE_KEYS.PARKS, SEED_PARKS);
    setStoredItem(
      STORAGE_KEYS.PARKS,
      parks.filter((p) => p.id !== id)
    );
  },

  // Clone from template to create a new park with initialized requirements
  async cloneFromTemplate(
    templateId: string,
    parkInfo: { name: string; state: string; location: string; description: string; contactPerson?: string }
  ): Promise<Park> {
    await delay();
    const templates = getStoredItem<ChecklistTemplate[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
    const template = templates.find((t) => t.id === templateId);
    if (!template) throw new Error('Plantilla no encontrada');

    const parks = getStoredItem<Park[]>(STORAGE_KEYS.PARKS, SEED_PARKS);
    const newParkId = `park-${Date.now()}`;
    const newPark: Park = {
      id: newParkId,
      name: parkInfo.name,
      state: parkInfo.state,
      location: parkInfo.location,
      description: parkInfo.description,
      contactPerson: parkInfo.contactPerson || '',
      status: 'draft',
      assignedUserIds: ['user-admin-1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    parks.push(newPark);
    setStoredItem(STORAGE_KEYS.PARKS, parks);

    // Create requirements for this park from template
    const globalRequirements = getStoredItem<Requirement[]>(STORAGE_KEYS.REQUIREMENTS, SEED_REQUIREMENTS);
    const parkRequirements = getStoredItem<ParkRequirement[]>(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);

    template.phases.forEach((phase) => {
      phase.requirements.forEach((reqTpl) => {
        const reqId = `req-cloned-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newReq: Requirement = {
          id: reqId,
          phaseCode: phase.code,
          title: reqTpl.title,
          description: reqTpl.description,
          specialty: reqTpl.specialty || 'general',
          categoryType: phase.code === 'phase-1' ? 'permits' : phase.code === 'phase-2' ? 'infrastructure' : 'signage',
          isExample: reqTpl.isExample,
          stateSpecific: template.state,
        };
        globalRequirements.push(newReq);

        const newParkReq: ParkRequirement = {
          id: `preq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          parkId: newParkId,
          requirementId: reqId,
          status: 'pending',
          evidence: [],
          notes: 'Generado desde plantilla: ' + template.name,
        };
        parkRequirements.push(newParkReq);
      });
    });

    setStoredItem(STORAGE_KEYS.REQUIREMENTS, globalRequirements);
    setStoredItem(STORAGE_KEYS.PARK_REQUIREMENTS, parkRequirements);

    return newPark;
  },
};

// ==========================================
// PHASE API (Data-driven ordered list)
// ==========================================
export const phaseApi = {
  async getAll(): Promise<Phase[]> {
    await delay();
    const phases = getStoredItem<Phase[]>(STORAGE_KEYS.PHASES, SEED_PHASES);
    return phases.sort((a, b) => a.order - b.order);
  },

  async create(phaseData: Omit<Phase, 'id'>): Promise<Phase> {
    await delay();
    const phases = getStoredItem<Phase[]>(STORAGE_KEYS.PHASES, SEED_PHASES);
    const newPhase: Phase = {
      ...phaseData,
      id: `phase-${Date.now()}`,
    };
    phases.push(newPhase);
    setStoredItem(STORAGE_KEYS.PHASES, phases);
    return newPhase;
  },

  async update(id: string, updates: Partial<Phase>): Promise<Phase> {
    await delay();
    const phases = getStoredItem<Phase[]>(STORAGE_KEYS.PHASES, SEED_PHASES);
    const index = phases.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Fase no encontrada');
    phases[index] = { ...phases[index], ...updates };
    setStoredItem(STORAGE_KEYS.PHASES, phases);
    return phases[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const phases = getStoredItem<Phase[]>(STORAGE_KEYS.PHASES, SEED_PHASES);
    setStoredItem(
      STORAGE_KEYS.PHASES,
      phases.filter((p) => p.id !== id)
    );
  },
};

// ==========================================
// REQUIREMENT API
// ==========================================
export const requirementApi = {
  async getAll(): Promise<Requirement[]> {
    await delay();
    return getStoredItem<Requirement[]>(STORAGE_KEYS.REQUIREMENTS, SEED_REQUIREMENTS);
  },

  async getByPhase(phaseCode: string): Promise<Requirement[]> {
    await delay();
    const all = getStoredItem<Requirement[]>(STORAGE_KEYS.REQUIREMENTS, SEED_REQUIREMENTS);
    return all.filter((r) => r.phaseCode === phaseCode);
  },

  async create(req: Omit<Requirement, 'id'>): Promise<Requirement> {
    await delay();
    const all = getStoredItem<Requirement[]>(STORAGE_KEYS.REQUIREMENTS, SEED_REQUIREMENTS);
    const newReq: Requirement = {
      ...req,
      id: `req-${Date.now()}`,
    };
    all.push(newReq);
    setStoredItem(STORAGE_KEYS.REQUIREMENTS, all);

    // Also associate to all existing parks as pending
    const parks = getStoredItem<Park[]>(STORAGE_KEYS.PARKS, SEED_PARKS);
    const parkReqs = getStoredItem<ParkRequirement[]>(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);
    parks.forEach((park) => {
      parkReqs.push({
        id: `preq-${Date.now()}-${park.id}`,
        parkId: park.id,
        requirementId: newReq.id,
        status: 'pending',
        evidence: [],
      });
    });
    setStoredItem(STORAGE_KEYS.PARK_REQUIREMENTS, parkReqs);

    return newReq;
  },

  async update(id: string, updates: Partial<Requirement>): Promise<Requirement> {
    await delay();
    const all = getStoredItem<Requirement[]>(STORAGE_KEYS.REQUIREMENTS, SEED_REQUIREMENTS);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Requisito no encontrado');
    all[idx] = { ...all[idx], ...updates };
    setStoredItem(STORAGE_KEYS.REQUIREMENTS, all);
    return all[idx];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const all = getStoredItem<Requirement[]>(STORAGE_KEYS.REQUIREMENTS, SEED_REQUIREMENTS);
    setStoredItem(
      STORAGE_KEYS.REQUIREMENTS,
      all.filter((r) => r.id !== id)
    );
    // Delete associated park requirements
    const parkReqs = getStoredItem<ParkRequirement[]>(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);
    setStoredItem(
      STORAGE_KEYS.PARK_REQUIREMENTS,
      parkReqs.filter((pr) => pr.requirementId !== id)
    );
  },

  // Park Specific Requirements & Status
  async getParkRequirements(parkId: string): Promise<ParkRequirement[]> {
    await delay();
    const parkReqs = getStoredItem<ParkRequirement[]>(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);
    return parkReqs.filter((pr) => pr.parkId === parkId);
  },

  async updateParkRequirementStatus(
    parkRequirementId: string,
    status: RequirementStatus,
    notes?: string,
    user?: User
  ): Promise<ParkRequirement> {
    await delay();
    const parkReqs = getStoredItem<ParkRequirement[]>(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);
    const idx = parkReqs.findIndex((pr) => pr.id === parkRequirementId);
    if (idx === -1) throw new Error('Seguimiento de requisito no encontrado');

    const current = parkReqs[idx];
    const updated: ParkRequirement = {
      ...current,
      status,
      notes: notes !== undefined ? notes : current.notes,
    };

    if (status === 'validated') {
      updated.validatedBy = user?.id || 'admin';
      updated.validatedByName = user?.name || 'Administrador';
      updated.validatedAt = new Date().toISOString();
    } else {
      updated.validatedBy = undefined;
      updated.validatedByName = undefined;
      updated.validatedAt = undefined;
    }

    parkReqs[idx] = updated;
    setStoredItem(STORAGE_KEYS.PARK_REQUIREMENTS, parkReqs);
    return updated;
  },

  async addEvidence(
    parkRequirementId: string,
    evidence: { type: 'before' | 'after'; url: string; caption: string; uploadedBy: string }
  ): Promise<ParkRequirement> {
    await delay();
    const parkReqs = getStoredItem<ParkRequirement[]>(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);
    const idx = parkReqs.findIndex((pr) => pr.id === parkRequirementId);
    if (idx === -1) throw new Error('Seguimiento no encontrado');

    const newEvidence: EvidenceItem = {
      ...evidence,
      id: `ev-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };

    parkReqs[idx].evidence = [...(parkReqs[idx].evidence || []), newEvidence];
    setStoredItem(STORAGE_KEYS.PARK_REQUIREMENTS, parkReqs);
    return parkReqs[idx];
  },

  async deleteEvidence(parkRequirementId: string, evidenceId: string): Promise<ParkRequirement> {
    await delay();
    const parkReqs = getStoredItem<ParkRequirement[]>(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);
    const idx = parkReqs.findIndex((pr) => pr.id === parkRequirementId);
    if (idx === -1) throw new Error('Seguimiento no encontrado');

    parkReqs[idx].evidence = parkReqs[idx].evidence.filter((e) => e.id !== evidenceId);
    setStoredItem(STORAGE_KEYS.PARK_REQUIREMENTS, parkReqs);
    return parkReqs[idx];
  },
};

// ==========================================
// INFRASTRUCTURE, AREAS & CATEGORIES API
// ==========================================
export const infrastructureApi = {
  // Areas
  async getAreas(parkId: string): Promise<Area[]> {
    await delay();
    const areas = getStoredItem<Area[]>(STORAGE_KEYS.AREAS, SEED_AREAS);
    return areas.filter((a) => a.parkId === parkId);
  },

  async createArea(area: Omit<Area, 'id'>): Promise<Area> {
    await delay();
    const areas = getStoredItem<Area[]>(STORAGE_KEYS.AREAS, SEED_AREAS);
    const newArea: Area = {
      ...area,
      id: `area-${Date.now()}`,
    };
    areas.push(newArea);
    setStoredItem(STORAGE_KEYS.AREAS, areas);
    return newArea;
  },

  async updateArea(id: string, updates: Partial<Area>): Promise<Area> {
    await delay();
    const areas = getStoredItem<Area[]>(STORAGE_KEYS.AREAS, SEED_AREAS);
    const idx = areas.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Área no encontrada');
    areas[idx] = { ...areas[idx], ...updates };
    setStoredItem(STORAGE_KEYS.AREAS, areas);
    return areas[idx];
  },

  async deleteArea(id: string): Promise<void> {
    await delay();
    const areas = getStoredItem<Area[]>(STORAGE_KEYS.AREAS, SEED_AREAS);
    setStoredItem(
      STORAGE_KEYS.AREAS,
      areas.filter((a) => a.id !== id)
    );
  },

  // Neurodivergence Categories
  async getCategories(): Promise<NeurodivergenceCategory[]> {
    await delay();
    return getStoredItem<NeurodivergenceCategory[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  },

  async createCategory(cat: Omit<NeurodivergenceCategory, 'id'>): Promise<NeurodivergenceCategory> {
    await delay();
    const categories = getStoredItem<NeurodivergenceCategory[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    const newCat: NeurodivergenceCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    categories.push(newCat);
    setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<NeurodivergenceCategory>): Promise<NeurodivergenceCategory> {
    await delay();
    const categories = getStoredItem<NeurodivergenceCategory[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Categoría no encontrada');
    categories[idx] = { ...categories[idx], ...updates };
    setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
    return categories[idx];
  },

  async deleteCategory(id: string): Promise<void> {
    await delay();
    const categories = getStoredItem<NeurodivergenceCategory[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    setStoredItem(
      STORAGE_KEYS.CATEGORIES,
      categories.filter((c) => c.id !== id)
    );
  },

  // Infrastructures
  async getInfrastructures(): Promise<Infrastructure[]> {
    await delay();
    return getStoredItem<Infrastructure[]>(STORAGE_KEYS.INFRASTRUCTURES, SEED_INFRASTRUCTURES);
  },

  async createInfrastructure(inf: Omit<Infrastructure, 'id'>): Promise<Infrastructure> {
    await delay();
    const list = getStoredItem<Infrastructure[]>(STORAGE_KEYS.INFRASTRUCTURES, SEED_INFRASTRUCTURES);
    const newInf: Infrastructure = {
      ...inf,
      id: `inf-${Date.now()}`,
    };
    list.push(newInf);
    setStoredItem(STORAGE_KEYS.INFRASTRUCTURES, list);
    return newInf;
  },

  async updateInfrastructure(id: string, updates: Partial<Infrastructure>): Promise<Infrastructure> {
    await delay();
    const list = getStoredItem<Infrastructure[]>(STORAGE_KEYS.INFRASTRUCTURES, SEED_INFRASTRUCTURES);
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Infraestructura no encontrada');
    list[idx] = { ...list[idx], ...updates };
    setStoredItem(STORAGE_KEYS.INFRASTRUCTURES, list);
    return list[idx];
  },

  async deleteInfrastructure(id: string): Promise<void> {
    await delay();
    const list = getStoredItem<Infrastructure[]>(STORAGE_KEYS.INFRASTRUCTURES, SEED_INFRASTRUCTURES);
    setStoredItem(
      STORAGE_KEYS.INFRASTRUCTURES,
      list.filter((i) => i.id !== id)
    );
  },

  // Matrix Area-Category-Infrastructure linkages
  async getMatrixData(parkId: string): Promise<AreaCategoryInfrastructure[]> {
    await delay();
    const list = getStoredItem<AreaCategoryInfrastructure[]>(
      STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE,
      SEED_AREA_CATEGORY_INFRASTRUCTURE
    );
    return list.filter((item) => item.parkId === parkId);
  },

  async linkInfrastructure(data: Omit<AreaCategoryInfrastructure, 'id'>): Promise<AreaCategoryInfrastructure> {
    await delay();
    const list = getStoredItem<AreaCategoryInfrastructure[]>(
      STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE,
      SEED_AREA_CATEGORY_INFRASTRUCTURE
    );
    const newItem: AreaCategoryInfrastructure = {
      ...data,
      id: `aci-${Date.now()}`,
    };
    list.push(newItem);
    setStoredItem(STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE, list);
    return newItem;
  },

  async updateMatrixItem(id: string, updates: Partial<AreaCategoryInfrastructure>): Promise<AreaCategoryInfrastructure> {
    await delay();
    const list = getStoredItem<AreaCategoryInfrastructure[]>(
      STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE,
      SEED_AREA_CATEGORY_INFRASTRUCTURE
    );
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Registro de matriz no encontrado');
    list[idx] = { ...list[idx], ...updates };
    setStoredItem(STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE, list);
    return list[idx];
  },

  async deleteMatrixItem(id: string): Promise<void> {
    await delay();
    const list = getStoredItem<AreaCategoryInfrastructure[]>(
      STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE,
      SEED_AREA_CATEGORY_INFRASTRUCTURE
    );
    setStoredItem(
      STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE,
      list.filter((i) => i.id !== id)
    );
  },
};

// ==========================================
// ASSOCIATIONS & CONTACTS API (Full CRUD)
// ==========================================
export const associationApi = {
  async getAll(): Promise<Association[]> {
    await delay();
    return getStoredItem<Association[]>(STORAGE_KEYS.ASSOCIATIONS, SEED_ASSOCIATIONS);
  },

  async create(assoc: Omit<Association, 'id'>): Promise<Association> {
    await delay();
    const list = getStoredItem<Association[]>(STORAGE_KEYS.ASSOCIATIONS, SEED_ASSOCIATIONS);
    const newAssoc: Association = {
      ...assoc,
      id: `assoc-${Date.now()}`,
    };
    list.push(newAssoc);
    setStoredItem(STORAGE_KEYS.ASSOCIATIONS, list);
    return newAssoc;
  },

  async update(id: string, updates: Partial<Association>): Promise<Association> {
    await delay();
    const list = getStoredItem<Association[]>(STORAGE_KEYS.ASSOCIATIONS, SEED_ASSOCIATIONS);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Asociación no encontrada');
    list[idx] = { ...list[idx], ...updates };
    setStoredItem(STORAGE_KEYS.ASSOCIATIONS, list);
    return list[idx];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const list = getStoredItem<Association[]>(STORAGE_KEYS.ASSOCIATIONS, SEED_ASSOCIATIONS);
    setStoredItem(
      STORAGE_KEYS.ASSOCIATIONS,
      list.filter((a) => a.id !== id)
    );
  },
};

// ==========================================
// SPECIAL SCHEDULES API
// ==========================================
export const scheduleApi = {
  async getByPark(parkId: string): Promise<ParkSchedule[]> {
    await delay();
    const schedules = getStoredItem<ParkSchedule[]>(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES);
    return schedules.filter((s) => s.parkId === parkId);
  },

  async create(schedule: Omit<ParkSchedule, 'id'>): Promise<ParkSchedule> {
    await delay();
    const schedules = getStoredItem<ParkSchedule[]>(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES);
    const newSchedule: ParkSchedule = {
      ...schedule,
      id: `sched-${Date.now()}`,
    };
    schedules.push(newSchedule);
    setStoredItem(STORAGE_KEYS.SCHEDULES, schedules);
    return newSchedule;
  },

  async update(id: string, updates: Partial<ParkSchedule>): Promise<ParkSchedule> {
    await delay();
    const schedules = getStoredItem<ParkSchedule[]>(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES);
    const idx = schedules.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Horario no encontrado');
    schedules[idx] = { ...schedules[idx], ...updates };
    setStoredItem(STORAGE_KEYS.SCHEDULES, schedules);
    return schedules[idx];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const schedules = getStoredItem<ParkSchedule[]>(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES);
    setStoredItem(
      STORAGE_KEYS.SCHEDULES,
      schedules.filter((s) => s.id !== id)
    );
  },
};

// ==========================================
// TEMPLATES API
// ==========================================
export const templateApi = {
  async getAll(): Promise<ChecklistTemplate[]> {
    await delay();
    return getStoredItem<ChecklistTemplate[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
  },

  async getById(id: string): Promise<ChecklistTemplate | undefined> {
    await delay();
    const templates = getStoredItem<ChecklistTemplate[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
    return templates.find((t) => t.id === id);
  },

  async create(tpl: Omit<ChecklistTemplate, 'id' | 'createdAt'>): Promise<ChecklistTemplate> {
    await delay();
    const templates = getStoredItem<ChecklistTemplate[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
    const newTpl: ChecklistTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    templates.push(newTpl);
    setStoredItem(STORAGE_KEYS.TEMPLATES, templates);
    return newTpl;
  },

  async update(id: string, updates: Partial<ChecklistTemplate>): Promise<ChecklistTemplate> {
    await delay();
    const templates = getStoredItem<ChecklistTemplate[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
    const idx = templates.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Plantilla no encontrada');
    templates[idx] = { ...templates[idx], ...updates };
    setStoredItem(STORAGE_KEYS.TEMPLATES, templates);
    return templates[idx];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const templates = getStoredItem<ChecklistTemplate[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
    setStoredItem(
      STORAGE_KEYS.TEMPLATES,
      templates.filter((t) => t.id !== id)
    );
  },
};

export { resetToSeedData };
