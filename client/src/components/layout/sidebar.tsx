import { webRoutes } from '../../routes/web';
import { BiHomeAlt2 } from 'react-icons/bi';
import { Children } from 'react';
import Icon, {
  KeyOutlined,
  BarChartOutlined,
  FileOutlined,
  BookOutlined,
  HomeOutlined,
  UserOutlined, 
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { FiUsers } from 'react-icons/fi';

export const sidebar = [
  {
    path: webRoutes.todos,
    key: 2,
    name: 'Todo Management',
    style: {fontSize: '50px'},
    routes: [
      {
        key: 21,
        path: webRoutes.todos,
        name: 'Todos',
        icon: <BookOutlined />,
        component: './Welcome',
      },
    ],
  }
];
