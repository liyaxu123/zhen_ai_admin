export interface LoginParams {
  username: string;
  password: string;
  verifyCode: string;
}

export interface RegisterParams {
  username: string;
  password: string;
}

export interface Result {
  code: number;
  data: any;
  msg: string;
  success: boolean;
}
