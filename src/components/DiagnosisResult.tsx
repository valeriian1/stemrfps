import React, { useState } from 'react';
import { DiagnosisResult as IDiagnosisResult, Disease } from '../types';
import { api } from '../services/api';

interface DiagnosisResultProps {
  results: IDiagnosisResult[];
  onSave: (diseaseId: string, confidence: number, severity: 'низький' | 'середній' | 'високий') => void;
}

const DiagnosisResultComponent: React.FC<DiagnosisResultProps> = ({ results, onSave }) => {
  const [selectedResult, setSelectedResult] = useState<IDiagnosisResult>(results[0]);
  const [severity, setSeverity] = useState<'низький' | 'середній' | 'високий'>('низький');

  const disease = api.getDiseaseById(selectedResult.diseaseId);

  if (!disease) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mt-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4">Результат діагностики</h3>
      
      <div className="space-y-4 mb-6">
        {results.map((res, idx) => {
          const d = api.getDiseaseById(res.diseaseId);
          if (!d) return null;
          
          return (
            <div 
              key={res.diseaseId}
              onClick={() => setSelectedResult(res)}
              className={`p-3 rounded-md border cursor-pointer transition-colors ${
                selectedResult.diseaseId === res.diseaseId 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-900">
                  {idx + 1}. {d.nameUk}
                </span>
                <span className="text-sm font-bold text-green-700">
                  {Math.round(res.confidence * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">{disease.nameUk}</h4>
        <p className="text-sm text-slate-700 mb-2"><strong>Симптоми:</strong> {disease.symptoms}</p>
        <p className="text-sm text-slate-700 mb-4"><strong>Рекомендації:</strong> {disease.treatment}</p>
        
        {disease.id !== 'healthy' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Ступінь ураження</label>
            <select 
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="низький">Низький</option>
              <option value="середній">Середній</option>
              <option value="високий">Високий</option>
            </select>
          </div>
        )}
      </div>

      <button 
        onClick={() => onSave(selectedResult.diseaseId, selectedResult.confidence, disease.id === 'healthy' ? 'низький' : severity)}
        className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm"
      >
        Зберегти в журнал
      </button>
    </div>
  );
};

export default DiagnosisResultComponent;
