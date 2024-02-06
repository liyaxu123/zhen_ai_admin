// @ts-ignore
/* eslint-disable */

declare namespace API {
  type UserInfo = {
    id?: string;
    username?: string;
    avatar?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current: number;
    pageSize: number;
  };

  type RuleListItem = {
    id: string;
    name?: string;
    desc?: string;
    status?: boolean;
    createdTime?: Date;
    updateTime?: Date;
    permissions?: any[];
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type PermissionListItem = {
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
  };

  type PermissionList = {
    code: number;
    data: {
      data: PermissionListItem[];
      total: number;
    };
    msg: string;
    success: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
