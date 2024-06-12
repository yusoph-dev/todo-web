import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import { useSelector } from 'react-redux';
import { 
  Form, 
  Input, 
  Avatar, 
  BreadcrumbProps, 
  Modal, 
  Space, 
  Col, 
  Divider, 
  Row, 
  message, 
  Upload, 
  DatePicker, 
  InputNumber,
  Mentions,
  Select,
  Card,
  TreeSelect,
  Button,
  Switch,
  List,
  Empty,
  Tooltip 
 } from 'antd';
import { Typography } from 'antd';
const { Text, Title } = Typography;
import type { UploadProps, SelectProps } from 'antd';
const { Dragger } = Upload;
import React, { useRef, useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { CiCircleMore } from 'react-icons/ci';
import { CloudUploadOutlined, AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { Todo } from '../../interfaces/models/todo';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import {
  handleErrorResponse,
  NotificationType,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import Icon, {
  ExclamationCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { RootState } from '../../store';
const { RangePicker } = DatePicker;
import type { SearchProps } from 'antd/es/input/Search';
import { set } from 'nprogress';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const formItemLayout2 = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};



const EditTodo = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const { id } = useParams();

  const [todo, setTodo] = useState<Todo | null>(null);

  const currentState = useSelector((state: RootState) => state.logged_user);

  const [openManageReportsTo, setOpenManagerReportsTo] = useState(false);
  const [confirmLoadingManager, setConfirmLoadingManager] = useState(false);

  useEffect(() => {
    document.title = 'Edit Todo';
    loadTodo()
  }, []);

  const loadTodo = () => {
    setLoading(true);
    return http
      .get(`${apiRoutes.todo}${id}`)
      .then((response) => {
        const data = response.data.data;
        setTodo(data.todo);
        setLoading(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };


  const handleSubmit = (values: any) => {
    
    return http
      .put(`${apiRoutes.update_todo}${id}`, values)
      .then((response) => {
        
        message.success(response.data.message);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  }

  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: 0,
        title: 'Todo Management',
      },
      {
        key: webRoutes.todos,
        title: <Link to={webRoutes.todos}>Todos</Link>,
      },
      {
        key: webRoutes.edit_todo,
        title: <Text strong>Edit - {(todo?.todo ? todo?.todo : 'Todo') || 'Todo'}</Text>,
      }
    ],
  };


  return (
    <BasePageContainer breadcrumb={breadcrumb}>

      <Row gutter={2} style={{ justifyContent: 'flex-end' }}>
        <Col flex={12} style={{justifyContent: 'flex-end'}}>
            <Title level={5}>Edit Todo</Title>
        </Col>
        <Col flex={12} style={{justifyContent: 'flex-end'}}>
          <Link to={webRoutes.todos} style={{float: 'right'}}>
            <Button>Back to List of Todos</Button>
          </Link>
        </Col>
      </Row>
      <Row gutter={2}> 
        <Col flex={14} style={{ borderRight: '1px solid #fbf0f0', padding: '1vw 2vw'}} >
          <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            
            {!loading ? (
              // Render UI components
                  <Form 
                    {...formItemLayout} 
                    variant="filled" 
                    style={{ maxWidth: 1200, width: '100%' }} 
                    onFinish={handleSubmit}
                    initialValues={{
                      todo: todo?.todo,
                      description: todo?.description
                    }}
                    >

                    <Form.Item
                      label="Todo"
                      name="todo"
                      rules={[{ required: true, message: 'Please input todo' }]}
                    >
                      <Input />
                    </Form.Item>
              

                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[{ required: true, message: 'Please input description' }]}
                    >
                      <Input.TextArea/>
                    </Form.Item>

                      <Button className="primary-btn primary" htmlType="submit" style={{float: 'right'}} >Update</Button>

                  </Form>
            ) : (
              // Display loading spinner or placeholder
              null
            )}

          </Col>
        </Col>
      </Row>
    </BasePageContainer>
  );
};

export default EditTodo;
