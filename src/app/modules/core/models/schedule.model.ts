import { Doctor } from './doctor.model';
import { Service } from './service.model';

export interface EmployeeGetAllSchedules {
  id: number;
  startedAt: string;
  finishedAt: string;
  doctor: Doctor;
  services: Service[];
}

export type DoctorsScheduleByDay = Record<
  string,
  {
    startedAt: string;
    finishedAt: string;
    doctor: Doctor;
    services: Service[];
  }[]
>;
