import { Layout, Menu } from 'antd';
import { useMemo } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import Login from './Login';
import Products from './Products';
import Categories from './Categories';
import Orders from './Orders';
import PointsRules from './PointsRules';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'products', label: <Link to="/products">商品管理</Link> },
  { key: 'categories', label: <Link to="/categories">类目管理</Link> },
  { key: 'orders', label: <Link to="/orders">订单管理</Link> },
  { key: 'points', label: <Link to="/points">积分规则</Link> },
];

const isAuthenticated = () => Boolean(localStorage.getItem('admin_token'));

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKeys = useMemo(() => {
    const path = location.pathname.replace('/', '');
    const current = menuItems.find((item) => path.startsWith(item.key));
    return current ? [current.key] : [];
  }, [location.pathname]);

  if (!isAuthenticated() && location.pathname !== '/login') {
    navigate('/login');
  }

  if (location.pathname === '/') {
    navigate('/products');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {location.pathname !== '/login' ? (
        <>
          <Sider collapsible>
            <div style={{ color: '#fff', padding: '16px', fontWeight: 600 }}>WeMall 管理</div>
            <Menu theme="dark" selectedKeys={selectedKeys} items={menuItems} />
          </Sider>
          <Layout>
            <Header style={{ background: '#fff' }}>欢迎使用 WeMall 管理平台</Header>
            <Content style={{ margin: '16px' }}>
              <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/points" element={<PointsRules />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Content>
          </Layout>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </Layout>
  );
}
