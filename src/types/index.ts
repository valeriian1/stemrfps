export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'farmer' | 'admin';
}

export interface Field {
  id: string;
  ownerId: string;
  name: string;
  crop: 'пшениця' | 'ячмінь' | 'кукурудза';
  areaHa: number;
}

export interface Disease {
  id: string;
  nameUk: string;
  crop: string;
  symptoms: string;
  treatment: string;
}

export interface Inspection {
  id: string;
  fieldId: string;
  diseaseId: string;
  confidence: number;
  severity: 'низький' | 'середній' | 'високий';
  photoThumb: string;
  createdAt: string;
}

export interface DiagnosisResult {
  diseaseId: string;
  confidence: number;
}
