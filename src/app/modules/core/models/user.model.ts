export interface UserLoginDataRequest {
  email: string,
  password: string
}

export interface AccessTokenResponse {
  accessToken: string,
  refreshToken: string
}

export class User {
  constructor(
    public email: string,
    public accessToken: string,
    public refreshToken: string
  ) {}
}
