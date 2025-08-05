export interface UserLoginDataRequest {
  email: string,
  password: string
}

export interface TokenResponse {
  accessToken: string,
  refreshToken: string
}

export interface UserLoginResponse {
  userId: string
}

export class User {
  constructor(
    public userId: number,
  ) {}
}
