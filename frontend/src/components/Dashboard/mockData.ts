import { Patient } from './types';

export const MOCK_PATIENTS_DATA: Patient[] = [
  { id: 1, name: 'Alice Cooper', age: 45, sex: 'F', lastConsultation: '2023-10-12', tag: 'Urgente' },
  { id: 2, name: 'Bob Smith', age: 32, sex: 'M', lastConsultation: '2023-09-01' },
  { id: 3, name: 'Charlie Johnson', age: 60, sex: 'M', lastConsultation: '2023-11-05' },
  { id: 4, name: 'Diana Prince', age: 28, sex: 'F', lastConsultation: '2023-12-01', tag: 'Acompanhamento' },
  { id: 5, name: 'Edward Elric', age: 22, sex: 'M', lastConsultation: '2024-01-15' },
];
