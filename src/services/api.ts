import seedData from '../data/seed.json';
import { Disease, Field, Inspection, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'stem_users',
  FIELDS: 'stem_fields',
  INSPECTIONS: 'stem_inspections',
  DISEASES: 'stem_diseases',
};

export const api = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DISEASES)) {
      localStorage.setItem(STORAGE_KEYS.DISEASES, JSON.stringify(seedData.diseases));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FIELDS)) {
      localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INSPECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify([]));
    }
  },

  getDiseases(): Disease[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISEASES) || '[]');
  },

  getDiseaseById(id: string): Disease | undefined {
    return this.getDiseases().find(d => d.id === id);
  },

  // Generic helpers
  getItem<T>(key: string): T[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  getFields(userId: string): Field[] {
    const allFields = this.getItem<Field>(this.KEYS.FIELDS);
    return allFields.filter(f => f.ownerId === userId);
  },

  addField(field: Omit<Field, 'id'>): Field {
    const fields = this.getItem<Field>(this.KEYS.FIELDS);
    const newField = { ...field, id: crypto.randomUUID() };
    fields.push(newField);
    this.setItem(this.KEYS.FIELDS, fields);
    return newField;
  },

  updateField(id: string, updates: Partial<Field>): Field {
    const fields = this.getItem<Field>(this.KEYS.FIELDS);
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Поле не знайдено');
    fields[index] = { ...fields[index], ...updates };
    this.setItem(this.KEYS.FIELDS, fields);
    return fields[index];
  },

  deleteField(id: string): void {
    const fields = this.getItem<Field>(this.KEYS.FIELDS);
    this.setItem(this.KEYS.FIELDS, fields.filter(f => f.id !== id));
  },

  getInspections(userId: string): Inspection[] {
    const userFields = this.getFields(userId).map(f => f.id);
    const allInspections = this.getItem<Inspection>(this.KEYS.INSPECTIONS);
    return allInspections.filter(i => userFields.includes(i.fieldId));
  },

  addInspection(inspection: Omit<Inspection, 'id' | 'createdAt'>): Inspection {
    const inspections = this.getItem<Inspection>(this.KEYS.INSPECTIONS);
    const newInspection = { 
      ...inspection, 
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    inspections.push(newInspection);
    this.setItem(this.KEYS.INSPECTIONS, inspections);
    return newInspection;
  },
  
  deleteInspection(id: string): void {
    const inspections = this.getItem<Inspection>(this.KEYS.INSPECTIONS);
    this.setItem(this.KEYS.INSPECTIONS, inspections.filter(i => i.id !== id));
  },

  KEYS: STORAGE_KEYS
};

// Initialize on load
api.init();
