export interface Patient {
  id: number | string;
  name: string;
  age: number;
  sex: string;
  lastConsultation: string;
  tag?: string;
  responsibleFigure?: string;
  phone?: string;
}
