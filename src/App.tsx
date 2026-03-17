import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { store } from './store';
import { router } from './routes';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
};

export default App;
