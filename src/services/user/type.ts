export interface LoginParams {
  username: string;
  password: string;
  verifyCode: string;
}

export interface LoginResult {
  data: any;
  access_token: string;
}
