// Auth & Users
export type UserRole = 'admin' | 'committee' | 'viewer';
export type CommitteeSpecialty = 'education' | 'psychology' | 'finance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialty?: CommitteeSpecialty; // Required if role is 'committee'
  avatar?: string;
  phone?: string;
  institution?: string;
}

// Parks
export type ParkStatus = 'draft' | 'in_progress' | 'ready_to_open' | 'open';

export interface Park {
  id: string;
  name: string;
  state: string;
  location: string;
  description: string;
  status: ParkStatus;
  contactPerson?: string;
  phone?: string;
  email?: string;
  assignedUserIds: string[]; // Committee and managers assigned to this park
  createdAt: string;
  updatedAt: string;
  targetOpenDate?: string;
}

// Phases (Data-driven, ordered list so new phases can be added)
export interface Phase {
  id: string;
  code: string; // e.g., 'phase-1', 'phase-2', 'phase-3'
  order: number;
  name: string;
  description?: string;
  isDefault?: boolean;
}

// Requirements & Status
export type RequirementStatus = 'pending' | 'in_progress' | 'completed' | 'validated';

export interface EvidenceItem {
  id: string;
  type: 'before' | 'after';
  url: string; // client-side data URL or object URL
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Requirement {
  id: string;
  phaseCode: string; // e.g. 'phase-1', 'phase-2', 'phase-3'
  title: string;
  description: string;
  specialty?: CommitteeSpecialty | 'general';
  categoryType?: 'permits' | 'infrastructure' | 'signage' | 'general';
  isExample?: boolean; // clearly labeled placeholder flag
  stateSpecific?: string; // Optional: specific to a state like 'Baja California'
}

export interface ParkRequirement {
  id: string;
  parkId: string;
  requirementId: string;
  status: RequirementStatus;
  evidence: EvidenceItem[];
  validatedBy?: string; // User ID of committee member or admin who validated
  validatedByName?: string;
  validatedAt?: string;
  notes?: string;
}

// Areas & Neurodivergence Categories
export interface Area {
  id: string;
  parkId: string;
  name: string;
  description?: string;
}

export interface NeurodivergenceCategory {
  id: string;
  name: string;
  description: string;
  isExample?: boolean; // clearly labeled placeholder per seed data rules
}

export type InfrastructureType = 'infrastructure' | 'equipment' | 'color_spec';

export interface Infrastructure {
  id: string;
  name: string;
  type: InfrastructureType;
  colorOrSpec: string; // e.g. "#7A9C8C - Verde Salvia Calmo mate", "Grip ergonómico acolchado"
  description?: string;
}

export interface AreaCategoryInfrastructure {
  id: string;
  parkId: string;
  areaId: string;
  categoryId: string;
  infrastructureId: string;
  isCompleted: boolean;
  isValidated: boolean;
  validatedBy?: string;
  validatedByName?: string;
  validatedAt?: string;
  notes?: string;
  beforePhoto?: string;
  afterPhoto?: string;
}

// Associations & Contacts
export type AssociationScope = 'local' | 'estatal' | 'nacional' | 'internacional';

export interface Association {
  id: string;
  name: string;
  contactPerson: string;
  scope: AssociationScope;
  email: string;
  phone: string;
  address?: string;
  state?: string;
  website?: string;
  notes?: string;
  isExample?: boolean;
}

// Special Schedules
export interface ParkSchedule {
  id: string;
  parkId: string;
  days: string[]; // e.g. ['Lunes', 'Miércoles', 'Viernes']
  startTime: string; // '08:00'
  endTime: string;   // '11:00'
  restrictions: string[]; // e.g. ['Sin perros', 'Ambiente sonoro controlado', 'Iluminación tenue / sin destellos']
  active: boolean;
  notes?: string;
}

// Templates for Replication
export interface ChecklistTemplate {
  id: string;
  name: string;
  state: string;
  description: string;
  phases: {
    order: number;
    code: string;
    name: string;
    requirements: {
      title: string;
      description: string;
      specialty?: CommitteeSpecialty | 'general';
      isExample?: boolean;
    }[];
  }[];
  createdAt: string;
}
