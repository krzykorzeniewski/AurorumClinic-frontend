export interface UserLoginDataRequest {
  email: string;
  password: string;
}

export type UserLoginDataTwoFactorTokenRequest = Omit<
  UserLoginDataRequest,
  'password'
>;
export type UserLoginDataTwoFactorRequest = TokenVerifyRequest;

export interface UserLoginResponse {
  twoFactorAuth: boolean;
  role: string;
}

export class User implements UserLoginResponse {
  constructor(
    readonly twoFactorAuth: boolean,
    readonly role: UserRole,
  ) {}
}

export interface UserRegisterRequest {
  name: string;
  surname: string;
  pesel: string | null;
  birthDate: string;
  email: string;
  password: string;
  phoneNumber: string;
}
export interface UserPasswordRecoverEmailRequest {
  email: string;
}

export interface UserPasswordResetRequest {
  token: string;
  password: string;
  email: string;
}

export type VerifyEmailTokenRequest = UserPasswordRecoverEmailRequest;

export interface TokenVerifyRequest {
  token: string;
  email: string;
}

export enum UserRole {
  DOCTOR = 'doctors',
  PATIENT = 'patients',
  ADMIN = 'admin',
}
