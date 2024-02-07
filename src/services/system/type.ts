export interface Permission {
  id: string;
  pid: string;
  name: string;
  icon: string;
  perms: string;
  component: string;
  menuType: 'M' | 'C' | 'F';
  sort: number;
  isShow: boolean;
  createTime: string;
  updateTime: string;
}

export interface PermissionQueryParams {
  pageNum: number;
  pageSize: number;
  id?: string;
  code?: string;
  updateTime?: {
    startTime?: Date;
    endTime?: Date;
  };
}

export interface TreeQueryParams {
  name?: string;
  isShow?: boolean;
  menuType?: 'M' | 'C' | 'F';
  code?: string;
  createTime?: {
    startTime?: Date;
    endTime?: Date;
  };
}

export interface PermissionQueryResult {
  code: number;
  data: Permission[];
  msg: string;
  success: boolean;
}

export interface CreatePermissionData {
  pid: string;
  name: string;
  icon: string;
  perms: string;
  component: string;
  menuType: 'M' | 'C' | 'F';
  sort: number;
  isShow: boolean;
  createTime: string;
  updateTime: string;
}

export interface RoleQueryParams {
  pageNum: number;
  pageSize: number;
  name?: string;
  status?: boolean;
}

export interface RoleQueryResult {
  code: number;
  data: any;
  msg: string;
  success: boolean;
}

export interface CreateRoleData {
  name: string;
  desc?: string;
  status: boolean;
  permissionIds: string[];
}

export interface UserQueryData {
  pageNum: number;
  pageSize: number;
  username?: string;
  nickname?: string;
  email?: string;
  tel?: string;
  createTime?: { startTime: string; endTime: string };
}
