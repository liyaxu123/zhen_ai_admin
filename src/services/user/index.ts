import { request } from '@umijs/max';
import { LoginParams, Result, RegisterParams } from './type';

enum API {
  login = '/api/v1/user/login',
  singIn = '/api/v1/user/register',
}

/**
 * @description 登录接口
 */
export async function loginApi(body: LoginParams, options?: { [key: string]: any }) {
  return request<Result>(API.login, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/**
 * @description 用户注册
 */
export async function registerApi(body: RegisterParams, options?: { [key: string]: any }) {
  return request<Result>(API.singIn, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
