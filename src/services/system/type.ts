export interface Permission {
  id: string;
  code: string;
  desc: string;
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

export interface PermissionQueryResult {
  code: number;
  data: {
    data: Permission[];
    total: number;
  };
  msg: string;
  success: boolean;
}

export interface CreatePermissionData {
  code: string;
  desc?: string;
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
