import { DiagnosisResult } from '../types';
import { api } from './api';

// Set to true when TensorFlow model is ready in /public/model/
const USE_TF_MODEL = false; 

export const diagnosisService = {
  async diagnose(file: File): Promise<DiagnosisResult[]> {
    if (USE_TF_MODEL) {
      // ЗАГЛУШКА: замінити моделлю
      // require('@tensorflow/tfjs') and load model from /model/model.json
      throw new Error('Модель TensorFlow ще не підключена.');
    } else {
      // Заглушка
      return new Promise((resolve) => {
        setTimeout(() => {
          const diseases = api.getDiseases();
          // Deterministic based on file name length
          const hash = file.name.length + file.size;
          const isHealthy = hash % 3 === 0;
          
          if (isHealthy) {
            resolve([{ diseaseId: 'healthy', confidence: 0.98 }]);
          } else {
            const index = hash % (diseases.length - 1) + 1; // skip healthy
            const d1 = diseases[index];
            const d2 = diseases[(index + 1) % diseases.length === 0 ? 1 : (index + 1) % diseases.length];
            const d3 = diseases[(index + 2) % diseases.length === 0 ? 1 : (index + 2) % diseases.length];
            
            resolve([
              { diseaseId: d1.id, confidence: 0.85 + (hash % 10) / 100 },
              { diseaseId: d2.id, confidence: 0.10 + (hash % 5) / 100 },
              { diseaseId: d3.id, confidence: 0.03 }
            ].sort((a, b) => b.confidence - a.confidence));
          }
        }, 1500);
      });
    }
  }
};
