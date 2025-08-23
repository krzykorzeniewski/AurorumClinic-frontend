export interface UserLoginDataRequest {
  email: string,
  password: string
}

export interface UserLoginResponse {
  userId: number,
  twoFactorAuth: boolean
}

export class User implements UserLoginResponse{
  constructor(
    public userId: number,
    public twoFactorAuth: boolean
  ) {}
}

export interface UserRegisterRequest {
  name: string,
  surname: string,
  pesel: string | null,
  birthDate: string,
  email: string,
  password: string,
  phoneNumber: string
}
export interface UserPasswordRecoverEmailRequest  {
  email: string,
}

export interface UserPasswordResetRequest {
  token: string | null,
  password: string
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}
