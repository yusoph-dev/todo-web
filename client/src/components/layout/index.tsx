import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { Dropdown } from 'antd';
import { ProLayout, ProLayoutProps } from '@ant-design/pro-components';
import Icon, { LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/logged_userSlice';
import { memo, useState, useEffect } from 'react';
import { sidebar } from './sidebar';
import { apiRoutes } from '../../routes/api';
import http from '../../utils/http';
import { handleErrorResponse } from '../../utils';
import { RiShieldUserFill } from 'react-icons/ri';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentState = useSelector((state: RootState) => state.logged_user);


  const defaultProps: ProLayoutProps = {
    title: '',
    // logo: '/icon.png',
    fixedHeader: true,
    fixSiderbar: true,
    layout: CONFIG.theme.sidebarLayout,
    route: {
      routes: sidebar,
    },

    // Collapse: false,
    // Collapsed: false,
    // CollapsePanel: false,
    // CollapsedPanel: false,
    siderMenuType: 'group',
    siderWidth: 250,
  };

  const logoutLoggedUser = () => {
    dispatch(logout());
    navigate(webRoutes.login, {
      replace: true,
    });
    
    http.post(apiRoutes.logout, currentState).catch((error) => {
      handleErrorResponse(error);
    });
  };

  return (
    <div className="h-screen">
      <ProLayout
        logo={<img src='/icon.png' alt="Logo" style={{ height: '50px' }} />}
        {...defaultProps}
        token={{
          sider: {
            colorMenuBackground: 'white',
          },
        }}
        location={location}
        onMenuHeaderClick={() => navigate(webRoutes.todos)}
        menuItemRender={(item, dom) => (
          <a
            onClick={(e) => {
              e.preventDefault();
              item.path && navigate(item.path);
            }}
            href={item.path}
          >
            {dom}
          </a>
        )}
        avatarProps={{
          icon: <img src={currentState?.file_name} alt="Logo" style={{ height: '50px' }} />,
          className: 'bg-primary bg-opacity-20 text-primary text-opacity-90',
          size: 'small',
          shape: 'square',
          title: currentState?.first_name+' '+currentState?.last_name,
          render: (_, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: 'Logout',
                      onClick: () => {
                        logoutLoggedUser();
                      },
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
      >
        <Outlet />
      </ProLayout>
    </div>
  );
};

export default memo(Layout);
