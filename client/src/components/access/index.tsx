import { BreadcrumbProps, Typography, Tabs } from 'antd';
const { Text } = Typography;
import { Link } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import Roles from './roles.jsx'; 
import Permissions from './permissions.jsx'
import React, { useState, useEffect } from 'react';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';


const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Todo Management</Link>,
    },
  ],
};

const access = () => {

  const [tab, setTab] = useState(0);

  const onChange = (key: string) => {
    setTab(tab+1)
  };

  let [currentTab, setCurrentTab] = useState([
    {
      label: `Roles`,
      key: `roles`,
      children: <Roles loadPermissions={tab} />,
    },
    {
      label: `Permissions`,
      key: `permission`,
      children: <Permissions />,
    },
  ]);

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Tabs
        onChange={onChange}
        type="card"
        items={currentTab}
      />
    </BasePageContainer>
  );
};

export default access;
