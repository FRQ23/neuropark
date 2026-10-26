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

const STORAGE_KEYS = {
  USERS: 'neuroparque_users',
  PARKS: 'neuroparque_parks',
  PHASES: 'neuroparque_phases',
  REQUIREMENTS: 'neuroparque_requirements',
  PARK_REQUIREMENTS: 'neuroparque_park_requirements',
  AREAS: 'neuroparque_areas',
  CATEGORIES: 'neuroparque_categories',
  INFRASTRUCTURES: 'neuroparque_infrastructures',
  AREA_CATEGORY_INFRASTRUCTURE: 'neuroparque_aci',
  ASSOCIATIONS: 'neuroparque_associations',
  SCHEDULES: 'neuroparque_schedules',
  TEMPLATES: 'neuroparque_templates',
  CURRENT_USER: 'neuroparque_current_user',
  ACCESSIBILITY: 'neuroparque_accessibility',
};

// Generic read/write to localStorage with fallback to seed data
export const getStoredItem = <T>(key: string, defaultData: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    // Auto-migrate legacy example strings out of stored data
    if (item.includes('Categoría de ejemplo') || item.includes('Requisito de ejemplo')) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultData;
  }
};

export const setStoredItem = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

// Reset entire database to initial seed data
export const resetToSeedData = (): void => {
  setStoredItem(STORAGE_KEYS.USERS, SEED_USERS);
  setStoredItem(STORAGE_KEYS.PARKS, SEED_PARKS);
  setStoredItem(STORAGE_KEYS.PHASES, SEED_PHASES);
  setStoredItem(STORAGE_KEYS.REQUIREMENTS, SEED_REQUIREMENTS);
  setStoredItem(STORAGE_KEYS.PARK_REQUIREMENTS, SEED_PARK_REQUIREMENTS);
  setStoredItem(STORAGE_KEYS.AREAS, SEED_AREAS);
  setStoredItem(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  setStoredItem(STORAGE_KEYS.INFRASTRUCTURES, SEED_INFRASTRUCTURES);
  setStoredItem(STORAGE_KEYS.AREA_CATEGORY_INFRASTRUCTURE, SEED_AREA_CATEGORY_INFRASTRUCTURE);
  setStoredItem(STORAGE_KEYS.ASSOCIATIONS, SEED_ASSOCIATIONS);
  setStoredItem(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES);
  setStoredItem(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
  setStoredItem(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]); // default to admin Laura Valenzuela
};

export { STORAGE_KEYS };
