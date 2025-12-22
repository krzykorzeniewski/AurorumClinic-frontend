import { communicationPreferences } from './user.model';

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

export type GetPatientResponse = GetPatientApiResponse;

export interface UpdatePatientEmployeeRequest {
  name: string;
  surname: string;
  pesel: string | null;
  birthdate: string;
  email: string;
  phoneNumber: string;
  newsletter: boolean;
}

export interface PatientAppointmentListSchedule {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
}
