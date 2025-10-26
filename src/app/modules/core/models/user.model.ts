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

export type GetPatientResponse = GetPatientApiResponse;
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
