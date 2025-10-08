import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, message } from 'antd';
import { useState } from 'react';

import api from '../hooks/useApi';

const statusMap: Record<string, string> = {
  on_shelf: '上架',
  off_shelf: '下架',
  deleted: '已删除',
};

export default function Products() {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery(['products'], async () => {
    const res = await api.get('/admin/products');
    return res.data;
  });

  const createProduct = useMutation(
    async (payload: any) => {
      await api.post('/admin/products', payload);
    },
    {
      onSuccess: () => {
        message.success('创建成功');
        queryClient.invalidateQueries(['products']);
      },
    },
  );

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '名称', dataIndex: 'name' },
    { title: '价格', dataIndex: 'price' },
    { title: '库存', dataIndex: 'stock' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value: string) => <Tag color={value === 'on_shelf' ? 'green' : 'red'}>{statusMap[value]}</Tag>,
    },
  ];

  const handleOpen = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      createProduct.mutate({
        ...values,
        images: values.images ? values.images.split(',') : [],
      });
      setVisible(false);
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleOpen}>
          新建商品
        </Button>
      </Space>
      <Table rowKey="id" loading={isLoading} dataSource={data} columns={columns} />
      <Modal title="新建商品" open={visible} onOk={handleOk} onCancel={() => setVisible(false)} confirmLoading={createProduct.isLoading}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="库存" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="images" label="图片链接 (逗号分隔)">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="on_shelf">
            <Select>
              <Select.Option value="on_shelf">上架</Select.Option>
              <Select.Option value="off_shelf">下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
