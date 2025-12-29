import { Doctor } from './doctor.model';

export interface GetDoctorAbsencesByEmployee {
  id: number;
  name: string;
  startedAt: string;
  finishedAt: string;
  doctor: Doctor;
}

export type GetDoctorAbsences = Omit<GetDoctorAbsencesByEmployee, 'doctor'>;

export class Absence {
  constructor(
    public id: number,
    public name: string,
    public startedAt: string,
    public finishedAt: string,
  ) {}
}

export interface DoctorCreateAbsenceByEmployee {
  name: string;
  startedAt: string;
  finishedAt: string;
  doctorId: number;
}

export type DoctorCreateAbsence = Omit<
  DoctorCreateAbsenceByEmployee,
  'doctorId'
>;
