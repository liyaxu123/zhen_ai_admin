import {
  deleteRoleByIDAPI,
  menuTreeAPI,
  roleCreateAPI,
  roleQueryAPI,
  roleUpdateAPI,
} from '@/services/system';
import { CreateRoleData } from '@/services/system/type';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Checkbox, Form, Popconfirm, Space, Tag, Tree, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

// 递归将树节点的id放到一个数组中
const getAllTreeDataId = (treeData: any[], checkedKeys: any[]) => {
  treeData.forEach((item) => {
    checkedKeys.push(item.id);
    if (item.children) {
      getAllTreeDataId(item.children, checkedKeys);
    }
  });

  return checkedKeys;
};

const Role = () => {
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [action, setAction] = useState<'add' | 'edit'>('add');
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  // 树节点，是否父子联动
  const [checkStrictly, setCheckStrictly] = useState<boolean>(false);
  // 展开的树节点
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '角色ID',
      dataIndex: 'id',
      width: 220,
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueEnum: {
        true: '启用',
        false: '停用',
      },
      render: (_, record) => (
        <Tag color={record.status ? 'success' : 'error'}>{record.status ? '启用' : '停用'}</Tag>
      ),
    },
    {
      title: '角色描述',
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
            setAction('edit');
            setCurrentRow(record);
            setCheckedKeys(
              record?.permissions ? record.permissions.map((item: any) => item.id) : [],
            );
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
            const { code } = await deleteRoleByIDAPI(record.id);
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

  async function getTreeData() {
    try {
      const { code, data } = await menuTreeAPI({});
      if (code === 200) {
        setTreeData(data);
      }
    } catch (error) {}
  }

  useEffect(() => {
    getTreeData();
  }, []);

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
              setCheckedKeys([]);
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
        request={async (params: any) => {
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

      <ModalForm
        formRef={formRef}
        title={action === 'add' ? '新建角色' : '编辑角色信息'}
        initialValues={
          action === 'edit'
            ? { ...currentRow, permissionIds: currentRow?.permissions?.map((item: any) => item.id) }
            : {
                status: true,
              }
        }
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (value: CreateRoleData) => {
          let code;
          if (action === 'add') {
            const res = await roleCreateAPI(value);
            code = res.code;
          }

          if (action === 'edit') {
            const res = await roleUpdateAPI(currentRow!.id, value);
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
        <ProFormSwitch
          label="状态"
          name="status"
          rules={[
            {
              required: true,
              message: '请选择状态',
            },
          ]}
        />
        <Form.Item
          label={
            <>
              <span style={{ marginRight: 10 }}>菜单权限</span>
              <Checkbox
                checked={checkStrictly}
                onChange={(e) => {
                  setCheckStrictly(e.target.checked);
                }}
              >
                父子联动
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setExpandedKeys(getAllTreeDataId(treeData, []));
                  } else {
                    setExpandedKeys([]);
                  }
                }}
              >
                展开/折叠
              </Checkbox>
            </>
          }
          name="permissionIds"
        >
          <Tree
            checkable
            checkStrictly={!checkStrictly}
            expandedKeys={expandedKeys}
            onExpand={(expandedKeys) => {
              setExpandedKeys(expandedKeys);
            }}
            checkedKeys={checkedKeys}
            fieldNames={{
              title: 'name',
              key: 'id',
            }}
            treeData={treeData}
            onCheck={(checkedKeys) => {
              let permissionIds = checkStrictly ? checkedKeys : checkedKeys?.checked;

              setCheckedKeys(checkedKeys);
              formRef.current?.setFieldsValue({
                permissionIds,
              });
            }}
          />
        </Form.Item>
      </ModalForm>
    </PageContainer>
  );
};

export default Role;
