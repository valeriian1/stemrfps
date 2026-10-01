import { Inspection, Disease } from '../types';

interface FilterParams {
  inspections: Inspection[];
  diseases: Disease[];
  fieldFilter: string;
  diseaseFilter: string;
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
}

export function filterInspections({
  inspections,
  diseases,
  fieldFilter,
  diseaseFilter,
  searchQuery,
  dateFrom,
  dateTo
}: FilterParams): Inspection[] {
  return inspections.filter(i => {
    if (fieldFilter && i.fieldId !== fieldFilter) return false;
    if (diseaseFilter && i.diseaseId !== diseaseFilter) return false;
    
    const date = new Date(i.createdAt);
    if (dateFrom && date < new Date(dateFrom)) return false;
    
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (date > to) return false;
    }

    if (searchQuery) {
      const d = diseases.find(dis => dis.id === i.diseaseId);
      if (!d || !d.nameUk.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
