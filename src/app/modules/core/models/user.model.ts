import { GetPatientApiResponse } from './patient.model';

export enum communicationPreferences {
  EMAIL = 'EMAIL',
  PHONE_NUMBER = 'PHONE_NUMBER',
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
