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
export type UpdatePatientRequest = Partial<
  Pick<
    GetPatientApiResponse,
    | 'email'
    | 'phoneNumber'
    | 'twoFactorAuth'
    | 'newsletter'
    | 'communicationPreferences'
  >
>;
