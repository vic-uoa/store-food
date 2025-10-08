import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, Modal, Space, Switch, Table, message } from 'antd';
import { useState } from 'react';

import api from '../hooks/useApi';

export default function PointsRules() {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery(['points-rules'], async () => {
    const res = await api.get('/admin/points-rules');
    return res.data;
  });

  const createRule = useMutation(
    async (payload: any) => {
      await api.post('/admin/points-rules', payload);
    },
    {
      onSuccess: () => {
        message.success('规则已保存');
        queryClient.invalidateQueries(['points-rules']);
      },
    },
  );

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: '比例',
      render: (record: any) => `每消费 ${record.ratioAmount} 元 = ${record.ratioPoint} 分`,
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      render: (value: number) => (value ? '是' : '否'),
    },
  ];

  const handleOk = () => {
    form.validateFields().then((values) => {
      createRule.mutate(values);
      setVisible(false);
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setVisible(true)}>
          新建规则
        </Button>
      </Space>
      <Table rowKey="id" loading={isLoading} dataSource={data} columns={columns} />
      <Modal title="积分规则" open={visible} onOk={handleOk} onCancel={() => setVisible(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="ratio_amount" label="金额" rules={[{ required: true }]}> 
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ratio_point" label="积分" rules={[{ required: true }]}> 
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked" initialValue>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
