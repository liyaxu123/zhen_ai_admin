import {
  createPermissionCodeAPI,
  deletePermissionCodeByIDAPI,
  editPermissionCodeByIDAPI,
  permissionQueryAPI,
} from '@/services/system';
import { CreatePermissionData } from '@/services/system/type';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message } from 'antd';
import React, { useRef, useState } from 'react';

const Permission: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 新建窗口的弹窗
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<'add' | 'edit'>('add');
  const [currentRow, setCurrentRow] = useState<API.PermissionListItem>();

  const columns: ProColumns<API.PermissionListItem>[] = [
    {
      title: '权限ID',
      dataIndex: 'id',
      width: 220,
      fixed: 'left',
      copyable: true,
    },
    {
      title: '权限Code',
      dataIndex: 'code',
    },
    {
      title: '权限描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
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
        headerTitle="权限标识"
        rowKey="id"
        columns={columns}
        scroll={{ x: 1000 }}
        pagination={{
          defaultPageSize: 10,
          showTotal: (total) => `共 ${total} 条数据`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
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
        rowSelection={{
          onChange: (_, selectedRows) => {
            console.log(selectedRows);
          },
        }}
        tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          // console.log(selectedRowKeys, selectedRows);

          return (
            <Space size={16}>
              <a onClick={onCleanSelected}>批量删除</a>
              <a onClick={onCleanSelected}>导出数据</a>
              <a onClick={onCleanSelected}>取消选择</a>
            </Space>
          );
        }}
        request={async (params) => {
          const res = await permissionQueryAPI({
            ...params,
            pageNum: params.current,
          });

          return {
            data: res.data.data,
            // 不然 table 会停止解析数据，即使有数据
            success: res.success,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: res.data.total,
          };
        }}
      />

      {/* 新建权限弹窗 */}
      <ModalForm
        title={action === 'add' ? '新建权限标识' : '编辑权限标识'}
        initialValues={action === 'edit' ? currentRow : {}}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (value: CreatePermissionData) => {
          let code;
          if (action === 'add') {
            const res = await createPermissionCodeAPI(value);
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
        <ProFormText
          rules={[
            {
              required: true,
              message: '权限Code为必填项',
            },
          ]}
          label="权限Code"
          name="code"
        />
        <ProFormTextArea label="权限描述" name="desc" />
      </ModalForm>
    </PageContainer>
  );
};

export default Permission;
