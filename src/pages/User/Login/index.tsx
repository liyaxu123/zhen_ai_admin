import { loginApi, registerApi } from '@/services/user';
import { LoginParams } from '@/services/user/type';
import { LockOutlined, UserOutlined, VerifiedOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { LoginFormPage, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Tabs, message, theme } from 'antd';
import * as crypto from 'crypto';
import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

type LoginType = 'login' | 'register';

const Login: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [loginType, setLoginType] = useState<LoginType>('login');
  const [verifyCodeSrc, setVerifyCodeSrc] = useState<string>(
    `http://localhost:3000/api/v1/user/verifyCode?bgColor=${encodeURIComponent('#eee')}`,
  );
  const { token } = theme.useToken();
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      if (loginType === 'login') {
        const res = await loginApi({
          ...values,
          password: md5(values.password!),
        });

        console.log(res);

        if (res.code === 200) {
          const userInfo = res.data.userInfo;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem('token', JSON.stringify(res.data.token));

          flushSync(() => {
            setInitialState((s: any) => {
              return {
                ...s,
                userInfo,
                token: res.data.token,
              };
            });
          });
          message.success('登录成功！');
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
          return;
        }
      }

      // 注册
      if (loginType === 'register') {
        const res = await registerApi(values);
        if (res.code === 200) {
          message.success('注册成功！');
          formRef.current?.resetFields();
          setLoginType('login');
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <LoginFormPage
      formRef={formRef}
      backgroundImageUrl="/images/login_bg.jpg"
      backgroundVideoUrl="/login_bg.mp4"
      logo={<img src="/images/logo-yhc2.png" />}
      title="荣耀萤火"
      subTitle="王者荣耀萤火开放素材管理平台"
      initialValues={{
        username: 'admin',
        password: '123456',
      }}
      onFinish={async (values) => {
        await handleSubmit(values as LoginParams);
      }}
      submitter={{ searchConfig: { submitText: loginType === 'login' ? '登录' : '注册' } }}
    >
      <Tabs
        centered
        activeKey={loginType}
        onChange={(activeKey) => {
          formRef.current?.resetFields();
          setLoginType(activeKey as LoginType);
        }}
        items={[
          {
            key: 'login',
            label: '账号密码登录',
          },
          {
            key: 'register',
            label: '新用户注册',
          },
        ]}
      />
      {loginType === 'login' && (
        <>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: (
                <UserOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={'prefixIcon'}
                />
              ),
            }}
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: (
                <LockOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={'prefixIcon'}
                />
              ),
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <ProFormText
              name="verifyCode"
              fieldProps={{
                size: 'large',
                prefix: (
                  <VerifiedOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder="请输入验证码"
              rules={[
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ]}
            />

            <img
              style={{
                height: 36,
                borderRadius: 4,
                cursor: 'pointer',
              }}
              src={verifyCodeSrc}
              onClick={() => {
                setVerifyCodeSrc(
                  `http://localhost:3000/api/v1/user/verifyCode?bgColor=${encodeURIComponent(
                    '#eee',
                  )}&time=${Date.now()}`,
                );
              }}
              alt="验证码"
            />
          </div>

          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </>
      )}

      {loginType === 'register' && (
        <>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: (
                <UserOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={'prefixIcon'}
                />
              ),
            }}
            placeholder="请输入用户名"
            rules={[
              {
                min: 5,
                max: 30,
                message: '用户名长度为5~30',
              },
              {
                validator: (_, value) =>
                  /^[a-zA-Z0-9#$%_-]+$/.test(value) || !value
                    ? Promise.resolve()
                    : Promise.reject(new Error('用户名只能由字母、数字或者 #、$、%、_、- 组成')),
              },
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: (
                <LockOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={'prefixIcon'}
                />
              ),
            }}
            placeholder="请输入密码"
            rules={[
              {
                min: 6,
                max: 30,
                message: '密码长度为6~30',
              },
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </>
      )}
    </LoginFormPage>
  );
};

export default Login;
