import { GetPatientApiResponse } from './patient.model';
import { UserRole } from './auth.model';

export enum communicationPreferences {
  EMAIL = 'EMAIL',
  PHONE_NUMBER = 'PHONE_NUMBER',
}

export interface GetUserApiResponse {
  id: number;
  name: string;
  surname: string;
  pesel: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  twoFactorAuth: boolean;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  role: UserRole;
  createdAt: string;
}

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

export interface GetUserProfileResponse {
  id: number;
  name: string;
  surname: string;
  pesel: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  twoFactorAuth: boolean;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
}

export interface UpdateUser {
  name: string;
  surname: string;
  pesel: string | null;
  birthdate: string;
  phoneNumber: string;
  email: string;
  twoFactorAuth: boolean;
}
