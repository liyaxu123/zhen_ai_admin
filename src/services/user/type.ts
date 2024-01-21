export interface LoginParams {
  username: string;
  password: string;
  verifyCode: string;
}

export interface RegisterParams {
  username: string;
  password: string;
}

export interface updateUserInfoParams {
  nickname: string;
  email: string;
  tel: string;
  intro?: string;
  avatar?: string;
}

export interface Result {
  code: number;
  data: any;
  msg: string;
  success: boolean;
}
