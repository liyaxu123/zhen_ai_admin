import { login } from '@/services/user';
import { LoginParams } from '@/services/user/type';
import { LockOutlined, MobileOutlined, UserOutlined, VerifiedOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Tabs, message, theme } from 'antd';
import { md5 } from 'js-md5';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

type LoginType = 'login' | 'register';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('login');
  const [verifyCodeSrc, setVerifyCodeSrc] = useState<string>(
    `http://localhost:3000/api/v1/user/verifyCode?bgColor=${encodeURIComponent('#eee')}`,
  );
  const { token } = theme.useToken();
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      const msg = await login(
        {
          ...values,
          password: md5(values.password!),
        },
        {
          skipErrorHandler: true,
        },
      );
      if (msg.access_token) {
        message.success('登录成功！');
        localStorage.setItem('loginInfo', JSON.stringify(msg));
        flushSync(() => {
          setInitialState((s: any) => {
            return {
              ...s,
              loginInfo: msg,
            };
          });
        });
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <LoginFormPage
      backgroundImageUrl="/images/login_bg2.png"
      backgroundVideoUrl="/login_bg.mp4"
      logo={<img style={{ width: 220 }} src="/images/logo.png" />}
      subTitle="兌岛货样编辑系统"
      initialValues={{
        username: 'admin',
        password: '123456',
      }}
      onFinish={async (values) => {
        await handleSubmit(values as LoginParams);
      }}
    >
      <Tabs
        centered
        activeKey={loginType}
        onChange={(activeKey) => {
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
        </>
      )}

      {loginType === 'register' && (
        <>
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: (
                <MobileOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={'prefixIcon'}
                />
              ),
            }}
            name="mobile"
            placeholder={'手机号'}
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <ProFormCaptcha
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
            captchaProps={{
              size: 'large',
            }}
            placeholder={'请输入验证码'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'获取验证码'}`;
              }
              return '获取验证码';
            }}
            name="captcha"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
            onGetCaptcha={async () => {
              message.success('获取验证码成功！验证码为：1234');
            }}
          />
        </>
      )}
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
    </LoginFormPage>
  );
};

export default Login;
