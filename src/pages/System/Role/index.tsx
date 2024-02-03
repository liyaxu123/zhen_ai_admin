import { roleQueryAPI } from '@/services/system';
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
import { useRef, useState } from 'react';

const Role = () => {
  const actionRef = useRef<ActionType>();
  const [action, setAction] = useState<'add' | 'edit'>('add');
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.PermissionListItem>();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '角色ID',
      dataIndex: 'id',
      width: 220,
      fixed: 'left',
      copyable: true,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '拥有权限',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
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
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="角色列表"
        actionRef={actionRef}
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
            <PlusOutlined /> 新建角色
          </Button>,
        ]}
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
              <a onClick={onCleanSelected}>批量删除</a>
              <a onClick={onCleanSelected}>导出数据</a>
              <a onClick={onCleanSelected}>取消选择</a>
            </Space>
          );
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        request={async (params) => {
          const res = await roleQueryAPI({
            ...params,
            pageNum: params.current,
          });

          return {
            data: res.data.data,
            success: res.success,
            total: res.data.total,
          };
        }}
      />

      {/* 新建权限弹窗 */}
      <ModalForm
        title={action === 'add' ? '新建角色' : '编辑角色信息'}
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
              message: '角色名称为必填项',
            },
          ]}
          label="角色名称"
          name="name"
        />
        <ProFormTextArea label="角色描述" name="desc" />
      </ModalForm>
    </PageContainer>
  );
};

export default Role;
