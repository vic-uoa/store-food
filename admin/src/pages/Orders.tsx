import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Table, Tag, message } from 'antd';

import api from '../hooks/useApi';

const statusColor: Record<string, string> = {
  pending_payment: 'orange',
  paid: 'blue',
  shipped: 'geekblue',
  completed: 'green',
  canceled: 'red',
};

export default function Orders() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['orders'], async () => {
    const res = await api.get('/admin/orders');
    return res.data;
  });

  const ship = useMutation(
    async (id: number) => {
      await api.post(`/admin/orders/${id}/ship`, {});
    },
    {
      onSuccess: () => {
        message.success('已标记发货');
        queryClient.invalidateQueries(['orders']);
      },
    },
  );

  const columns = [
    { title: '订单号', dataIndex: 'orderNo' },
    { title: '用户ID', dataIndex: 'userId' },
    { title: '应付', dataIndex: 'payAmount' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value: string) => <Tag color={statusColor[value]}>{value}</Tag>,
    },
    {
      title: '操作',
      render: (_: unknown, record: any) => (
        <Button type="link" disabled={record.status !== 'paid'} onClick={() => ship.mutate(record.id)}>
          发货
        </Button>
      ),
    },
  ];

  return <Table rowKey="id" loading={isLoading} dataSource={data} columns={columns} />;
}
