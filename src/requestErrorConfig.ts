import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  timeout: 10000,
  baseURL: 'http://localhost:3000',
  withCredentials: true, // 跨域时允许携带凭证（例如，Cookie）

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // console.log('errorHandler', error);

      message.error(error.response.data.data.message);

      if (error.response.statusText === 'Unauthorized') {
        history.replace('/user/login');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // console.log('config', config);

      // 注入token
      const token = localStorage.getItem('token');

      if (config.url !== '/api/v1/user/login' && token) {
        (config.headers as Record<string, any>).authorization = `Bearer ${JSON.parse(token)}`;
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // console.log('responseInterceptors', response);

      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data?.success === false) {
        message.error(data.errorMessage);
      }
      return response;
    },
  ],
};
