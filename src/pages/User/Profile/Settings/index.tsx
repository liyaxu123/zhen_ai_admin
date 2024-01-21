import { updateUserInfoApi } from '@/services/user';
import { UploadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { PageContainer, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Card, Col, Row, Space, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useRef, useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ProfileSettings = () => {
  const { setInitialState } = useModel('@@initialState');
  const formRef = useRef<ProFormInstance>();
  const [fileList, setFileList] = useState<any>(() => {
    const avatarUrl = JSON.parse(localStorage.getItem('userInfo') || '{}')?.avatar;

    return avatarUrl
      ? [
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: avatarUrl,
          },
        ]
      : [];
  });

  return (
    <PageContainer header={{ children: '完善个人信息' }} breadcrumbRender={false}>
      <Card>
        <ProForm
          formRef={formRef}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          submitter={{
            searchConfig: { submitText: '更新个人信息' },
            render: (props, doms) => {
              return (
                <Row>
                  <Col span={14} offset={4}>
                    <Space>{doms}</Space>
                  </Col>
                </Row>
              );
            },
          }}
          initialValues={JSON.parse(localStorage.getItem('userInfo') || '{}')}
          onFinish={async (values) => {
            try {
              const userId = JSON.parse(localStorage.getItem('userInfo') || '{}').id;
              const { code, data } = await updateUserInfoApi(userId, values);
              if (code === 200) {
                setInitialState((s: any) => {
                  return {
                    ...s,
                    userInfo: data,
                  };
                });
                localStorage.setItem('userInfo', JSON.stringify(data));
                message.success('更新个人信息成功');
              }
            } catch (error) {
              console.log('修改用户信息失败：', error);
            }
          }}
        >
          <ProFormText
            width="md"
            name="nickname"
            label="昵称"
            placeholder="请输入昵称"
            fieldProps={{
              showCount: true,
              maxLength: 20,
            }}
            rules={[
              {
                min: 1,
                max: 20,
                message: '昵称长度需在1到20个字符之间!',
              },
              {
                required: true,
                message: '请输入昵称!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              {
                type: 'email',
                message: '请输入正确的邮箱!',
              },
              {
                required: true,
                message: '请输入邮箱!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="tel"
            label="手机号码"
            placeholder="请输入手机号码"
            rules={[
              {
                validator: (_, value) =>
                  /^1[3456789]\d{9}$/.test(value) || !value
                    ? Promise.resolve()
                    : Promise.reject(new Error('请输入正确的手机号码!')),
              },
              {
                required: true,
                message: '请输入联系电话!',
              },
            ]}
          />
          <ProFormTextArea
            width="md"
            name="intro"
            label="个人简介"
            placeholder="请输入个人简介"
            fieldProps={{
              showCount: true,
              maxLength: 200,
            }}
          />

          {/* 图片上传支持，图片裁切 */}
          <ProForm.Item label="头像" name="avatar">
            <ImgCrop rotationSlider showGrid cropShape="round">
              <Upload
                name="avatar"
                maxCount={1}
                action="http://localhost:3000/api/upload/avatar"
                accept=".jpg,.jpeg,.png"
                fileList={fileList}
                listType="picture-card"
                // 携带token
                headers={{
                  authorization: `Bearer ${JSON.parse(localStorage.getItem('token')!)}`,
                }}
                beforeUpload={(file) => {
                  // 校验文件格式为：jpg、jpeg、png
                  const isJpgOrPng =
                    file.type === 'image/jpg' ||
                    file.type === 'image/jpeg' ||
                    file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('只能上传.jpg、.jpeg、.png 格式的图片');
                  }

                  // 校验文件大小不能超过10Mb
                  const isLt10M = file.size / 1024 / 1024 < 10;
                  if (!isLt10M) {
                    message.error('图片大小不能超过10Mb');
                  }
                  return isJpgOrPng && isLt10M ? true : Upload.LIST_IGNORE;
                }}
                onChange={(info) => {
                  let newFileList = [...info.fileList];
                  newFileList = newFileList.map((file) => {
                    if (file.response) {
                      file.url = file.response.data.url;
                    }
                    return file;
                  });
                  setFileList(newFileList);

                  formRef.current?.setFieldsValue({
                    avatar: newFileList[0]?.url,
                  });
                }}
                onPreview={async (file: UploadFile) => {
                  let src = file.url as string;
                  if (!src) {
                    src = await new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file.originFileObj as FileType);
                      reader.onload = () => resolve(reader.result as string);
                    });
                  }
                  const image = new Image();
                  image.src = src;
                  const imgWindow = window.open(src);
                  imgWindow?.document.write(image.outerHTML);
                }}
              >
                {fileList.length < 1 && (
                  <Space>
                    <UploadOutlined />
                    单击上传
                  </Space>
                )}
              </Upload>
            </ImgCrop>
          </ProForm.Item>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default ProfileSettings;
