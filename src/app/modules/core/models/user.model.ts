export enum communicationPreferences {
  EMAIL = 'EMAIL',
  PHONE_NUMBER = 'PHONE_NUMBER',
}

export interface GetPatientApiResponse {
  id: number;
  name: string;
  surname: string;
  pesel: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  twoFactorAuth: boolean;
  newsletter: boolean;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  communicationPreferences: communicationPreferences;
}

export type GetPatientResponse = Omit<GetPatientApiResponse, 'id'>;
export type UpdateEmailTokenRequest = Partial<
  Pick<GetPatientApiResponse, 'email'>
>;
export type UpdatePhoneTokenRequest = Partial<
  Pick<GetPatientApiResponse, 'phoneNumber'>
>;
export interface UpdateTokenRequest {
  token: string;
}
export type PatchUserRequest = Partial<
  Pick<GetPatientApiResponse, 'newsletter' | 'communicationPreferences'>
>;

export interface GetRecommendedDoctorApiResponse {
  id: number;
  name: string;
  surname: string;
  specialization: string;
  profilePicture: string;
  rating: string;
}

export class DoctorRecommended implements GetRecommendedDoctorApiResponse {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public specialization: string,
    public profilePicture: string,
    public rating: string,
  ) {}
}

export interface GetDoctorAppointmentInfo {
  id: number;
  name: string;
  surname: string;
  specialization: string;
  profilePicture: string;
  date: string;
  price: number;
}

export interface AppointmentStatus {
  startedAt: string;
  status: string;
}

export class DoctorAppointment implements GetDoctorAppointmentInfo {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public specialization: string,
    public profilePicture: string,
    public date: string,
    public price: number,
  ) {}
}

export class Doctor {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public specialization: string,
    public profilePicture: string,
  ) {}
}

export interface GetAppointmentInfo {
  id: number;
  startedAt: string;
  status: string;
  doctor: Doctor;
  service: Service;
}

export class Appointment implements GetAppointmentInfo {
  constructor(
    public id: number,
    public startedAt: string,
    public status: string,
    public doctor: Doctor,
    public service: Service,
  ) {}
}

export class Service {
  constructor(
    public id: number,
    public name: string,
    public price: number,
  ) {}
}
