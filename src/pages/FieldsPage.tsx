import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Field } from '../types';
import { fieldSchema } from '../schemas';
import { EmptyState, ErrorMessage } from '../components/UIHelpers';

type FieldForm = z.infer<typeof fieldSchema>;

const FieldsPage: React.FC = () => {
  const { user } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FieldForm>({
    resolver: zodResolver(fieldSchema)
  });

  useEffect(() => {
    if (user) loadFields();
  }, [user]);

  const loadFields = () => {
    if (user) setFields(api.getFields(user.id));
  };

  const onSubmit = (data: FieldForm) => {
    try {
      if (isEditing) {
        api.updateField(isEditing, data);
      } else {
        api.addField({ ...data, ownerId: user!.id });
      }
      setIsAdding(false);
      setIsEditing(null);
      reset();
      loadFields();
    } catch (err: any) {
      setError(err.message || 'Помилка збереження поля');
    }
  };

  const startEdit = (field: Field) => {
    setIsEditing(field.id);
    setIsAdding(true);
    setValue('name', field.name);
    setValue('crop', field.crop);
    setValue('areaHa', field.areaHa);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити це поле?')) {
      api.deleteField(id);
      loadFields();
    }
  };

  const cancelForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    reset();
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Мої поля</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
          >
            Додати поле
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-medium mb-4">{isEditing ? 'Редагувати поле' : 'Нове поле'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Назва поля</label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Культура</label>
                <select
                  {...register('crop')}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                >
                  <option value="">Оберіть...</option>
                  <option value="пшениця">Пшениця</option>
                  <option value="ячмінь">Ячмінь</option>
                  <option value="кукурудза">Кукурудза</option>
                </select>
                {errors.crop && <p className="mt-1 text-sm text-red-600">{errors.crop.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Площа (га)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('areaHa', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
                {errors.areaHa && <p className="mt-1 text-sm text-red-600">{errors.areaHa.message}</p>}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium"
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                Зберегти
              </button>
            </div>
          </form>
        </div>
      )}

      {!isAdding && fields.length === 0 ? (
        <EmptyState 
          message="У вас ще немає доданих полів." 
          actionText="Додати перше поле" 
          onAction={() => setIsAdding(true)} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map(field => (
            <div key={field.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900">{field.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => startEdit(field)} className="text-slate-400 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(field.id)} className="text-slate-400 hover:text-red-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 capitalize">{field.crop}</p>
              <p className="text-sm text-slate-600 mt-1">{field.areaHa} га</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldsPage;
