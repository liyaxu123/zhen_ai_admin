import { request } from '@umijs/max';
import {
  CreatePermissionData,
  CreateRoleData,
  PermissionQueryParams,
  PermissionQueryResult,
  RoleQueryParams,
  TreeQueryParams,
} from './type';

enum API {
  permission = '/api/permission',
  role = '/api/role',
}

/**
 * @description 权限菜单 分页查询
 */
export async function permissionQueryAPI(
  params: PermissionQueryParams,
  options?: { [key: string]: any },
) {
  return request<PermissionQueryResult>(API.permission, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * @description 查询菜单权限树
 */
export async function menuTreeAPI(body: TreeQueryParams, options?: { [key: string]: any }) {
  return request<PermissionQueryResult>(`${API.permission}/tree`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/**
 * @description 权限字典 创建权限Code
 */
export async function createPermissionCodeAPI(
  body: CreatePermissionData,
  options?: { [key: string]: any },
) {
  return request<PermissionQueryResult>(API.permission, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/**
 * @description 权限菜单 根据ID编辑权限Code
 */
export async function editPermissionCodeByIDAPI(
  id: string,
  body: CreatePermissionData,
  options?: { [key: string]: any },
) {
  return request<PermissionQueryResult>(`${API.permission}/${id}`, {
    method: 'PATCH',
    data: body,
    ...(options || {}),
  });
}

/**
 * @description 权限菜单 根据ID删除权限字段
 */
export async function deletePermissionCodeByIDAPI(id: string, options?: { [key: string]: any }) {
  return request<PermissionQueryResult>(`${API.permission}/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * @description 角色管理 分页查询
 */
export async function roleQueryAPI(params: RoleQueryParams, options?: { [key: string]: any }) {
  return request<PermissionQueryResult>(API.role, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * @description 角色管理 创建角色
 */
export async function roleCreateAPI(body: CreateRoleData, options?: { [key: string]: any }) {
  return request<PermissionQueryResult>(API.role, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/**
 * @description 角色管理 编辑角色信息
 */
export async function roleUpdateAPI(
  id: string,
  body: CreateRoleData,
  options?: { [key: string]: any },
) {
  return request<PermissionQueryResult>(`${API.role}/${id}`, {
    method: 'PATCH',
    data: body,
    ...(options || {}),
  });
}

/**
 * @description 角色管理 根据ID删除角色
 */
export async function deleteRoleByIDAPI(id: string, options?: { [key: string]: any }) {
  return request<PermissionQueryResult>(`${API.role}/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
