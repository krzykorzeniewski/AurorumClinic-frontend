import { Doctor } from './doctor.model';
import { Service } from './service.model';
import { Payment } from './api-response.model';

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

export interface AppointmentStatus {
  startedAt: string;
  status: string;
}
