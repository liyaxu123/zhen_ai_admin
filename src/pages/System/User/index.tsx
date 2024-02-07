import { userQueryAPI } from '@/services/system';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Image, Popconfirm } from 'antd';
import moment from 'moment';

const User = () => {
  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 100,
      fixed: 'left',
    },
    {
      title: '用户ID',
      dataIndex: 'id',
      width: 220,
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      width: 80,
      render: (_, record) => <Image width={60} src={record.avatar} />,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 80,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
    },
    {
      title: '电话',
      dataIndex: 'tel',
      width: 120,
    },
    {
      title: '个人简介',
      dataIndex: 'intro',
      hideInSearch: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      width: 160,
      render: (_, record) => {
        return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '拥有角色',
      dataIndex: 'roles',
      hideInSearch: true,
      width: 120,
      fixed: 'right',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 120,
      fixed: 'right',
      render: (text, record) => [
        <Button
          type="link"
          key="editable"
          style={{ padding: 4 }}
          onClick={() => {
            console.log(record);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="删除提示"
          description="您确定要执行删除操作吗？"
          onConfirm={async () => {}}
        >
          <Button type="link" danger style={{ padding: 4 }}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="权限标识"
        rowKey="id"
        scroll={{ x: 1500 }}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <PlusOutlined /> 新建
          </Button>,
        ]}
        rowSelection={{}}
        request={async (params: any) => {
          const res = await userQueryAPI({
            ...params,
            pageNum: params.current,
            createTime: params?.createTime && {
              startTime: params?.createTime?.[0],
              endTime: params?.createTime?.[1],
            },
          });

          return {
            data: res?.data?.data,
            success: res.success,
            total: res?.data?.total,
          };
        }}
      />
    </PageContainer>
  );
};

export default User;
