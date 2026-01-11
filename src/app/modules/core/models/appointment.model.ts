import { Doctor } from './doctor.model';
import { Service } from './service.model';
import { Payment } from './api-response.model';
import { PatientAppointmentListSchedule, PatientShort } from './patient.model';

export interface GetAppointmentInfo {
  id: number;
  startedAt: string;
  status: string;
  description: string;
  doctor: Doctor;
  service: Service;
  payment: Payment;
  hasOpinion: boolean;
  hasChat: boolean;
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
    public hasOpinion: boolean,
    public hasChat: boolean,
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

export interface GetDailyAppointmentInfo {
  id: number;
  status: AppointmentStatus;
  startedAt: string;
  description: string;
  doctor: Doctor;
  service: Service;
  payment: Payment;
  patient: PatientShort;
}

export enum PaymentMethod {
  OFFLINE = 'OFFLINE',
  CREDIT_CARD = 'CREDIT_CARD',
  BLIK = 'BLIK',
  GOOGLE_PAY = 'GOOGLE_PAY',
  APPLE_PAY = 'APPLE_PAY',
}

export interface PaymentRequest {
  paymentMethod: PaymentMethod;
}
