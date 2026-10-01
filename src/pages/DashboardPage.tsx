import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Disease, Field, Inspection } from '../types';
import { Loader } from '../components/UIHelpers';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    fieldsCount: 0,
    inspectionsCount: 0,
    diseasesLast30Days: 0,
  });
  const [topDiseases, setTopDiseases] = useState<{ disease: Disease; count: number; percentage: number }[]>([]);
  const [recentInspections, setRecentInspections] = useState<(Inspection & { fieldName: string; diseaseName: string })[]>([]);

  useEffect(() => {
    if (user) {
      const fields = api.getFields(user.id);
      const inspections = api.getInspections(user.id);
      const diseases = api.getDiseases();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentInspectionsData = inspections.filter(i => new Date(i.createdAt) >= thirtyDaysAgo);
      const diseasedRecent = recentInspectionsData.filter(i => i.diseaseId !== 'healthy');

      // Top diseases
      const diseaseCounts: Record<string, number> = {};
      diseasedRecent.forEach(i => {
        diseaseCounts[i.diseaseId] = (diseaseCounts[i.diseaseId] || 0) + 1;
      });

      const totalDiseased = diseasedRecent.length;
      const top = Object.entries(diseaseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, count]) => ({
          disease: diseases.find(d => d.id === id)!,
          count,
          percentage: totalDiseased > 0 ? (count / totalDiseased) * 100 : 0
        }));

      // Last 5
      const last5 = inspections
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(i => ({
          ...i,
          fieldName: fields.find(f => f.id === i.fieldId)?.name || 'Невідоме поле',
          diseaseName: diseases.find(d => d.id === i.diseaseId)?.nameUk || 'Невідомо'
        }));

      setStats({
        fieldsCount: fields.length,
        inspectionsCount: inspections.length,
        diseasesLast30Days: diseasedRecent.length
      });
      setTopDiseases(top);
      setRecentInspections(last5);
      setLoading(false);
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Кількість полів</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.fieldsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Всього обстежень</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.inspectionsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Виявлено хвороб (за 30 днів)</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.diseasesLast30Days}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Топ-3 найчастіші хвороби</h3>
          {topDiseases.length > 0 ? (
            <div className="space-y-4">
              {topDiseases.map((item) => (
                <div key={item.disease.id}>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-slate-700">{item.disease.nameUk}</span>
                    <span className="text-slate-500">{item.count} виявлень</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Немає даних за останні 30 днів</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Останні обстеження</h3>
          {recentInspections.length > 0 ? (
            <div className="space-y-4">
              {recentInspections.map(i => (
                <div key={i.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{i.fieldName}</p>
                    <p className={`text-xs ${i.diseaseId === 'healthy' ? 'text-green-600' : 'text-red-500'}`}>
                      {i.diseaseName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{new Date(i.createdAt).toLocaleDateString('uk-UA')}</p>
                    <p className="text-xs text-slate-500 font-medium">Впевненість: {Math.round(i.confidence * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Ще немає обстежень</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
