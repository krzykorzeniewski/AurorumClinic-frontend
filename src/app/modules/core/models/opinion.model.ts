import { PatientOpinion } from './patient.model';

export interface SortType {
  value: string;
  viewValue: string;
}

export interface OpinionGroup {
  name: string;
  sortType: SortType[];
}

export interface Opinion {
  id: number;
  rating: number;
  comment: string;
  answer: string;
  createdAt: string;
  answeredAt: string;
  patient: PatientOpinion;
}
