import { Button, Card, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import api from '../hooks/useApi';

export default function Login() {
  const navigate = useNavigate();

  const handleFinish = async (values: { passcode: string }) => {
    if (!values.passcode) {
      message.error('请输入管理员口令');
      return;
    }
    const res = await api.post('/auth/admin/mock-login', {});
    localStorage.setItem('admin_token', res.data.token);
    message.success('登录成功');
    navigate('/products');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card title="WeMall 管理后台" style={{ width: 320 }}>
        <Form onFinish={handleFinish} layout="vertical">
          <Form.Item label="管理员口令" name="passcode">
            <Input.Password placeholder="请输入" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
