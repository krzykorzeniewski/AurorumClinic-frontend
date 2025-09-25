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
  communicationPreferences: communicationPreferences;
}

export type GetPatientResponse = Omit<GetPatientApiResponse, 'id'>;
export type UpdateEmailTokenRequest = Partial<
  Pick<GetPatientApiResponse, 'email'>
>;
export interface UpdateEmailRequest {
  token: string;
}
export type PatchUserRequest = Partial<
  Pick<GetPatientApiResponse, 'newsletter' | 'communicationPreferences'>
>;
