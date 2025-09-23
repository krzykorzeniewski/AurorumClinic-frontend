export interface UserLoginDataRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  userId: number;
  email: string;
  twoFactorAuth: boolean;
  role: string;
}

export class User implements UserLoginResponse {
  constructor(
    readonly userId: number,
    readonly email: string,
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
  token: string | null;
  password: string;
}

export type VerifyEmailTokenRequest = UserPasswordRecoverEmailRequest;

export interface TokenVerifyRequest {
  token: string;
  email: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export enum UserRole {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  ADMIN = 'admin',
}
