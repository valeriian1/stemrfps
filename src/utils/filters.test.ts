import { describe, it, expect } from 'vitest';
import { filterInspections } from './filters';
import { Inspection, Disease } from '../types';

describe('filterInspections', () => {
  const mockDiseases: Disease[] = [
    { id: 'd1', nameUk: 'Бура іржа', crop: 'пшениця', symptoms: '', treatment: '' },
    { id: 'd2', nameUk: 'Сажка', crop: 'всі', symptoms: '', treatment: '' },
  ];

  const mockInspections: Inspection[] = [
    { id: 'i1', fieldId: 'f1', diseaseId: 'd1', confidence: 0.9, severity: 'низький', photoThumb: '', createdAt: '2023-10-01T10:00:00Z' },
    { id: 'i2', fieldId: 'f2', diseaseId: 'd2', confidence: 0.8, severity: 'середній', photoThumb: '', createdAt: '2023-10-05T10:00:00Z' },
    { id: 'i3', fieldId: 'f1', diseaseId: 'd2', confidence: 0.95, severity: 'високий', photoThumb: '', createdAt: '2023-10-10T10:00:00Z' },
  ];

  it('filters by field', () => {
    const res = filterInspections({
      inspections: mockInspections, diseases: mockDiseases,
      fieldFilter: 'f1', diseaseFilter: '', searchQuery: '', dateFrom: '', dateTo: ''
    });
    expect(res.length).toBe(2);
    expect(res.map(i => i.id)).toEqual(['i1', 'i3']);
  });

  it('filters by disease', () => {
    const res = filterInspections({
      inspections: mockInspections, diseases: mockDiseases,
      fieldFilter: '', diseaseFilter: 'd2', searchQuery: '', dateFrom: '', dateTo: ''
    });
    expect(res.length).toBe(2);
    expect(res.map(i => i.id)).toEqual(['i2', 'i3']);
  });

  it('filters by search query', () => {
    const res = filterInspections({
      inspections: mockInspections, diseases: mockDiseases,
      fieldFilter: '', diseaseFilter: '', searchQuery: 'іржа', dateFrom: '', dateTo: ''
    });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('i1');
  });

  it('filters by date range', () => {
    const res = filterInspections({
      inspections: mockInspections, diseases: mockDiseases,
      fieldFilter: '', diseaseFilter: '', searchQuery: '', dateFrom: '2023-10-04', dateTo: '2023-10-06'
    });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('i2');
  });
});
