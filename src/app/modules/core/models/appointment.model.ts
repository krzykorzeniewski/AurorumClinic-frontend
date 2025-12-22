import { Doctor } from './doctor.model';
import { Service } from './service.model';
import { Payment } from './api-response.model';
import { PatientAppointmentListSchedule } from './patient.model';

export interface GetAppointmentInfo {
  id: number;
  startedAt: string;
  status: string;
  description: string;
  doctor: Doctor;
  service: Service;
  payment: Payment;
}

export class Appointment implements GetAppointmentInfo {
  constructor(
    public id: number,
    public startedAt: string,
    public status: string,
    public description: string,
    public doctor: Doctor,
    public service: Service,
    public payment: Payment,
  ) {}
}

export type AppointmentsSlots = Record<string, string[]>;

export interface CreateAppointmentPatient {
  startedAt: string;
  serviceId: number;
  doctorId: number;
  description: string;
}

export interface CreateAppointmentPatientByEmployee {
  patientId: number;
  startedAt: string;
  serviceId: number;
  doctorId: number;
  description: string;
}

export interface RescheduleAppointmentPatient {
  startedAt: string;
  description: string;
}

export enum PaymentStatus {
  CREATED = 'CREATED',
  COMPLETED = 'COMPLETED',
  DELETED = 'DELETED',
}

export enum AppointmentStatus {
  CREATED = 'CREATED',
  FINISHED = 'FINISHED',
}

export interface GetScheduleAppointmentInfo {
  id: number;
  startedAt: string;
  status: string;
  description: string;
  doctor?: Doctor;
  service: Service;
  payment: Payment;
  patient: PatientAppointmentListSchedule;
}
