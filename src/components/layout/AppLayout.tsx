import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { ShoppingOutlined } from '@ant-design/icons';
import './AppLayout.scss';

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div
          className="app-header__logo"
          onClick={() => navigate('/products')}
        >
          <ShoppingOutlined className="app-header__icon" />
          <span className="app-header__title">Product Store</span>
        </div>
      </Header>
      <Content className="app-content">
        <Outlet />
      </Content>
      <Footer className="app-footer">
        Product Store &copy; {new Date().getFullYear()} — React Developer Assessment
      </Footer>
    </Layout>
  );
};

export default AppLayout;
