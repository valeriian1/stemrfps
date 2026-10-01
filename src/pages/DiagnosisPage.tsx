import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { diagnosisService } from '../services/diagnosisService';
import { Field, DiagnosisResult as IDiagnosisResult } from '../types';
import PhotoUploader from '../components/PhotoUploader';
import DiagnosisResultComponent from '../components/DiagnosisResult';
import { EmptyState } from '../components/UIHelpers';

const DiagnosisPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [results, setResults] = useState<IDiagnosisResult[] | null>(null);

  useEffect(() => {
    if (user) {
      const userFields = api.getFields(user.id);
      setFields(userFields);
      if (userFields.length > 0) {
        setSelectedFieldId(userFields[0].id);
      }
    }
  }, [user]);

  const handleAnalyze = async (file: File) => {
    const res = await diagnosisService.diagnose(file);
    setResults(res);
  };

  const handleSave = (diseaseId: string, confidence: number, severity: 'низький' | 'середній' | 'високий') => {
    if (!selectedFieldId) return;

    // В реальності тут було б створення мініатюри через canvas.
    // Для демо зберігаємо як є (в рамках лімітів або просто пустий рядок).
    api.addInspection({
      fieldId: selectedFieldId,
      diseaseId,
      confidence,
      severity,
      photoThumb: '' // ЗАГЛУШКА: генерація base64 мініатюри
    });

    navigate('/journal');
  };

  if (fields.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Діагностика</h1>
        <EmptyState 
          message="Для початку діагностики необхідно додати хоча б одне поле." 
          actionText="Перейти до полів" 
          onAction={() => navigate('/fields')} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">Нова діагностика</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Оберіть поле для обстеження</label>
        <select
          value={selectedFieldId}
          onChange={(e) => setSelectedFieldId(e.target.value)}
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        >
          {fields.map(f => (
            <option key={f.id} value={f.id}>{f.name} ({f.crop})</option>
          ))}
        </select>
      </div>

      <PhotoUploader onAnalyze={handleAnalyze} />

      {results && (
        <DiagnosisResultComponent results={results} onSave={handleSave} />
      )}
    </div>
  );
};

export default DiagnosisPage;
