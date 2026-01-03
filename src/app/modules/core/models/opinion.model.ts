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
  createdAt: string;
  answer: string | null;
  answeredAt: string | null;
  patient: PatientOpinion;
}

export interface CreateOpinionPatient {
  rating: number;
  comment: string;
}

export type UpdateOpinionPatient = CreateOpinionPatient;

export interface AnswerOpinionDoctor {
  answer: string;
}

export type UpdateAnswerOpinionDoctor = AnswerOpinionDoctor;
