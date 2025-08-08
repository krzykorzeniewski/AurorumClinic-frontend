export interface UserLoginDataRequest {
  email: string,
  password: string
}

export interface UserLoginResponse {
  userId: string
}

export class User {
  constructor(
    public userId: number,
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
