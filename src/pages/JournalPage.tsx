import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Inspection, Field, Disease } from '../types';
import { EmptyState } from '../components/UIHelpers';
import { filterInspections } from '../utils/filters';

type SortOrder = 'asc' | 'desc';

const JournalPage: React.FC = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);

  const [fieldFilter, setFieldFilter] = useState<string>('');
  const [diseaseFilter, setDiseaseFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    setFields(api.getFields(user!.id));
    setInspections(api.getInspections(user!.id));
    setDiseases(api.getDiseases());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей запис?')) {
      api.deleteInspection(id);
      loadData();
    }
  };

  const filteredInspections = filterInspections({
    inspections,
    diseases,
    fieldFilter,
    diseaseFilter,
    searchQuery,
    dateFrom,
    dateTo
  }).sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Журнал обстежень</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Поле</label>
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="">Всі поля</option>
              {fields.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Хвороба (фільтр)</label>
            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="">Всі хвороби</option>
              {diseases.map(d => (
                <option key={d.id} value={d.id}>{d.nameUk}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Пошук за назвою</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Напр. іржа"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')}
              className="w-full py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center"
            >
              Сортування: {sortOrder === 'desc' ? 'Новіші' : 'Старіші'}
              <svg className={`ml-2 w-4 h-4 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Дата від</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Дата до</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div className="lg:col-span-2 flex items-end">
             <button
              onClick={() => {
                setFieldFilter('');
                setDiseaseFilter('');
                setSearchQuery('');
                setDateFrom('');
                setDateTo('');
              }}
              className="w-full lg:w-auto px-4 py-2 text-sm text-green-600 font-medium hover:text-green-700"
             >
               Скинути фільтри
             </button>
          </div>
        </div>
      </div>

      {filteredInspections.length === 0 ? (
        <EmptyState message="За вашими критеріями не знайдено жодного обстеження." />
      ) : (
        <>
          {/* Mobile View (Cards) */}
          <div className="block md:hidden space-y-4">
            {filteredInspections.map(i => {
              const field = fields.find(f => f.id === i.fieldId);
              const disease = diseases.find(d => d.id === i.diseaseId);
              return (
                <div key={i.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-slate-900">{field?.name}</h3>
                    <span className="text-xs text-slate-500">{new Date(i.createdAt).toLocaleDateString('uk-UA')}</span>
                  </div>
                  <p className={`text-sm mb-1 ${i.diseaseId === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                    {disease?.nameUk}
                  </p>
                  <p className="text-xs text-slate-600 mb-3">
                    Впевненість: {Math.round(i.confidence * 100)}% 
                    {i.diseaseId !== 'healthy' && ` • Ураження: ${i.severity}`}
                  </p>
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete(i.id)} className="text-sm text-red-600 hover:text-red-700 font-medium">
                      Видалити
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View (Table) */}
          <div className="hidden md:block bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Поле</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Діагноз</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ступінь</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Дії</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredInspections.map(i => {
                  const field = fields.find(f => f.id === i.fieldId);
                  const disease = diseases.find(d => d.id === i.diseaseId);
                  return (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(i.createdAt).toLocaleDateString('uk-UA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {field?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={i.diseaseId === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                          {disease?.nameUk}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">({Math.round(i.confidence * 100)}%)</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {i.diseaseId === 'healthy' ? '-' : i.severity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:text-red-900">Видалити</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default JournalPage;
