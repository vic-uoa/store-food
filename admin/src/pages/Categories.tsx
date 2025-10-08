import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal, Space, Table, message } from 'antd';
import { useState } from 'react';

import api from '../hooks/useApi';

export default function Categories() {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery(['categories'], async () => {
    const res = await api.get('/admin/categories');
    return res.data;
  });

  const createCategory = useMutation(
    async (payload: any) => {
      await api.post('/admin/categories', payload);
    },
    {
      onSuccess: () => {
        message.success('保存成功');
        queryClient.invalidateQueries(['categories']);
      },
    },
  );

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '名称', dataIndex: 'name' },
    { title: '排序', dataIndex: 'sortOrder' },
  ];

  const handleOk = () => {
    form.validateFields().then((values) => {
      createCategory.mutate(values);
      setVisible(false);
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => setVisible(true)} type="primary">
          新建类目
        </Button>
      </Space>
      <Table rowKey="id" loading={isLoading} dataSource={data} columns={columns} />
      <Modal title="类目" open={visible} onOk={handleOk} onCancel={() => setVisible(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sort_order" label="排序" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
