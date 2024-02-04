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
  id?: string;
  code?: string;
  updateTime?: {
    startTime?: Date;
    endTime?: Date;
  };
}
