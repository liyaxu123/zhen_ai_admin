import {
  createPermissionCodeAPI,
  deletePermissionCodeByIDAPI,
  editPermissionCodeByIDAPI,
  menuTreeAPI,
} from '@/services/system';
import { CreatePermissionData } from '@/services/system/type';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';

const Permission: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = useState<any[]>([]);
  // 新建窗口的弹窗
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<'add' | 'edit'>('add');
  const [currentRow, setCurrentRow] = useState<API.PermissionListItem>();

  const columns: ProColumns<API.PermissionListItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
      hideInSearch: true,
    },
    {
      title: '权限标识',
      tooltip: "控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)",
      dataIndex: 'perms',
      hideInSearch: true,
    },
    {
      title: '组件路径',
      tooltip: '访问的组件路径，如：`system/user/index`，默认在`views`目录下',
      dataIndex: 'component',
      hideInSearch: true,
    },
    {
      title: '显示状态',
      dataIndex: 'isShow',
      tooltip: '选择隐藏则路由将不会出现在侧边栏，但仍然可以访问',
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: '显示',
        false: '隐藏',
      },
      render: (_, record) => (
        <Tag color={record.isShow ? 'success' : 'error'}>{record.isShow ? '显示' : '隐藏'}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, record) => {
        return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss');
      },
      width: 160,
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      valueEnum: {
        M: '目录',
        C: '菜单',
        F: '按钮',
      },
      render: (_, record) => {
        let color, text;
        if (record.menuType === 'M') {
          color = '#108ee9';
          text = '目录';
        }
        if (record.menuType === 'C') {
          color = '#87d068';
          text = '菜单';
        }
        if (record.menuType === 'F') {
          color = '#e7c840';
          text = '按钮';
        }

        return <Tag color={color}>{text}</Tag>;
      },
      width: 80,
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
            // console.log(text, record, action);
            setAction('edit');
            setCurrentRow(record);
            handleModalOpen(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="删除提示"
          description="您确定要执行删除操作吗？"
          onConfirm={async () => {
            const { code } = await deletePermissionCodeByIDAPI(record.id);
            if (code === 200) {
              message.success('删除成功');
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
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
      <ProTable<API.PermissionListItem, API.PageParams>
        actionRef={actionRef}
        headerTitle="权限菜单树"
        rowKey="id"
        columns={columns}
        scroll={{ x: 1100 }}
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setAction('add');
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params: any) => {
          const res = await menuTreeAPI({
            ...params,
            isShow: params?.isShow && (params?.isShow === 'true' ? true : false),
            createTime: params?.createTime && {
              startTime: params?.createTime?.[0],
              endTime: params?.createTime?.[1],
            },
          });
          setTreeData(res.data);

          return {
            data: res.data,
            // 不然 table 会停止解析数据，即使有数据
            success: res.success,
          };
        }}
      />

      {/* 新建权限弹窗 */}
      <ModalForm
        title={action === 'add' ? '新建菜单' : '编辑菜单'}
        initialValues={action === 'edit' ? currentRow : {}}
        layout="horizontal"
        labelCol={{ span: 5 }}
        width="600px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (value: CreatePermissionData) => {
          console.log('onFinish', value);

          let code;
          if (action === 'add') {
            const res = await createPermissionCodeAPI({ ...value, pid: value.pid.toString() });
            code = res.code;
          }

          if (action === 'edit') {
            const res = await editPermissionCodeByIDAPI(currentRow!.id, value);
            code = res.code;
          }

          if (code === 200) {
            message.success(action === 'add' ? '创建成功' : '编辑成功');
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormTreeSelect
          label="上级菜单"
          name="pid"
          initialValue={['0']}
          fieldProps={{
            fieldNames: {
              label: 'name',
              value: 'id',
            },
            treeDefaultExpandAll: true,
            placeholder: '请选择上级菜单',
          }}
          rules={[
            {
              required: true,
              message: '请选择上级菜单',
            },
          ]}
          request={async () => {
            // const { data } = await menuTreeAPI();
            // console.log('获取菜单权限树', data);

            return [
              {
                name: '主目录',
                id: '0',
                children: treeData,
              },
            ];
          }}
        />
        <ProFormRadio.Group
          label="菜单类型"
          name="menuType"
          initialValue="M"
          options={[
            {
              label: '目录',
              value: 'M',
            },
            {
              label: '菜单',
              value: 'C',
            },
            {
              label: '按钮',
              value: 'F',
            },
          ]}
          rules={[
            {
              required: true,
              message: '请选择菜单类型',
            },
          ]}
        />
        <ProFormText
          label="菜单名称"
          name="name"
          rules={[
            {
              required: true,
              message: '菜单名称为必填项',
            },
          ]}
        />
        <ProFormDependency name={['menuType']}>
          {({ menuType }) => {
            return menuType === 'M' || menuType === 'C' ? (
              <ProFormText label="菜单图标" name="icon" />
            ) : null;
          }}
        </ProFormDependency>

        <ProFormDigit
          label="显示排序"
          name="sort"
          rules={[
            {
              required: true,
              message: '显示排序为必填项',
            },
          ]}
        />
        <ProFormDependency name={['menuType']}>
          {({ menuType }) => {
            return menuType === 'C' ? (
              <ProFormText
                label="组件路径"
                name="component"
                tooltip="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
              />
            ) : null;
          }}
        </ProFormDependency>

        <ProFormRadio.Group
          label="显示状态"
          name="isShow"
          initialValue={true}
          options={[
            {
              label: '显示',
              value: true,
            },
            {
              label: '隐藏',
              value: false,
            },
          ]}
          rules={[
            {
              required: true,
              message: '请选择菜单显示状态',
            },
          ]}
          tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
        />
        <ProFormDependency name={['menuType']}>
          {({ menuType }) => {
            return menuType === 'C' || menuType === 'F' ? (
              <ProFormText label="权限标识" name="perms" />
            ) : null;
          }}
        </ProFormDependency>
      </ModalForm>
    </PageContainer>
  );
};

export default Permission;
