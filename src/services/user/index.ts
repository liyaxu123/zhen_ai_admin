import { request } from '@umijs/max';
import { LoginParams, LoginResult } from './type';

enum API {
  login = '/api/v1/user/login',
}

/**
 * @description 登录接口
 */
export async function login(body: LoginParams, options?: { [key: string]: any }) {
  return request<LoginResult>(API.login, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
