import { Doctor } from './doctor.model';
import { Service } from './service.model';

export interface EmployeeGetSchedules {
  id: number;
  startedAt: string;
  finishedAt: string;
  doctor: Doctor;
  services: Service[];
}

export type DoctorsScheduleByDay = Record<
  string,
  {
    id: number;
    startedAt: string;
    finishedAt: string;
    doctor: Doctor;
    services: Service[];
  }[]
>;

export interface UpdateDoctorSchedule {
  startedAt: string;
  finishedAt: string;
  serviceIds: number[];
}
