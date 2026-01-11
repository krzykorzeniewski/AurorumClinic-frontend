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
  id: number;
  twoFactorAuth: boolean;
  role: string;
}

export class User implements UserLoginResponse {
  constructor(
    readonly id: number,
    readonly twoFactorAuth: boolean,
    readonly role: UserRoleMap,
  ) {}
}

export interface PatientRegisterRequest {
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

export interface UserPasswordChangeRequest {
  password: string;
}

export type VerifyEmailTokenRequest = UserPasswordRecoverEmailRequest;

export interface TokenVerifyRequest {
  token: string;
  email: string;
}

export interface DoctorRegisterRequest {
  name: string;
  surname: string;
  pesel: string | null;
  birthDate: string;
  email: string;
  phoneNumber: string;
  description: string;
  education: string;
  experience: string;
  pwzNumber: string | null;
  specializationIds: number[];
}

export type EmployeeRegisterRequest = Omit<PatientRegisterRequest, 'password'>;

export enum UserRoleMap {
  DOCTOR = 'doctors',
  PATIENT = 'patients',
  EMPLOYEE = 'employees',
  ADMIN = 'admin',
  ANONYMOUS = 'anonymous',
}

export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}
