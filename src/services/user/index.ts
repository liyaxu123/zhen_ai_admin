import { request } from '@umijs/max';
import { LoginParams, RegisterParams, Result, updateUserInfoParams } from './type';

enum API {
  login = '/api/v1/user/login',
  singIn = '/api/v1/user/register',
  updateUserInfo = '/api/v1/user',
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

/**
 * @description 修改用户信息
 */
export async function updateUserInfoApi(
  userId: string,
  body: updateUserInfoParams,
  options?: { [key: string]: any },
) {
  return request<Result>(`${API.updateUserInfo}/${userId}`, {
    method: 'PATCH',
    data: body,
    ...(options || {}),
  });
}
