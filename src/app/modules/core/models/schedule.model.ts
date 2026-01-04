import { Doctor } from './doctor.model';
import { Service } from './service.model';

export interface DayDto {
  hours: string[];
  serviceIds: number[];
}

export interface EmployeeGetSchedules {
  id: number;
  startedAt: string;
  finishedAt: string;
  doctor: Doctor;
  services: Service[];
}

export interface DoctorGetSchedules {
  id: number;
  startedAt: string;
  finishedAt: string;
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

export type DoctorScheduleByDay = Record<
  string,
  {
    id: number;
    startedAt: string;
    finishedAt: string;
    services: Service[];
  }[]
>;

export interface UpdateDoctorSchedule {
  startedAt: string;
  finishedAt: string;
  serviceIds: number[];
}

export interface CreateDailyDoctorScheduleByEmployee {
  startedAt: string;
  finishedAt: string;
  doctorId: number;
  serviceIds: number[];
}
export type CreateDailyDoctorScheduleByDoctor = Omit<
  CreateDailyDoctorScheduleByEmployee,
  'doctorId'
>;
export interface CreateWeeklyDoctorScheduleByEmployee {
  mon: DayDto;
  tue: DayDto;
  wed: DayDto;
  thu: DayDto;
  fri: DayDto;
  startedAt: string;
  finishedAt: string;
  doctorId: number;
}
export type CreateWeeklyDoctorScheduleByDoctor = Omit<
  CreateWeeklyDoctorScheduleByEmployee,
  'doctorId'
>;
