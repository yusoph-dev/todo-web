import { 
  Form, 
  Input, 
  BreadcrumbProps, 
  Col, 
  Row, 
  message, 
  DatePicker, 
  Button,
 } from 'antd';
import { Typography } from 'antd';
const { Text, Title } = Typography;
import React, { useRef, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Todo } from '../../interfaces/models/todo';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import {
  handleErrorResponse,
} from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';

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
  ],
};

const CreateTodo = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();


  useEffect(() => {
    document.title = 'Create Todo';
  }, []);

  const handleSubmit = (values: any) => {
    const formData = new FormData();
    formData.append('todo', values.todo);
    formData.append('description', values.description);

    const headers = { 'Content-Type': 'multipart/form-data' };

    return http
      .post(`${apiRoutes.create_todo}`, formData, { headers })
      .then((response) => {
        const data = response.data;
        message.success(data.message);
        navigate('/todos-management/todos');

      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  }

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Row gutter={2} style={{ justifyContent: 'flex-end' }}>
        <Col flex={12} style={{justifyContent: 'flex-end'}}>
            <Title level={5}>Create Todo</Title>
        </Col>
        <Col flex={12} style={{justifyContent: 'flex-end'}}>
          <Link to={webRoutes.todos} style={{float: 'right'}}>
            <Button>Back to Todo List</Button>
          </Link>
        </Col>
      </Row>
      <Row gutter={2}> 
        <Col flex={24} style={{ borderRight: '1px solid #fbf0f0', padding: '1vw 2vw'}} >

          <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            
            {!loading ? (
              // Render UI components
                  <Form 
                    {...formItemLayout} 
                    variant="filled" 
                    style={{ maxWidth: 1200, width: '100%' }} 
                    onFinish={handleSubmit}
                    initialValues={{
                      todo: '',
                      description: ''
                    }}
                    >

                    <Form.Item
                      label="Todo"
                      name="todo"
                      rules={[{ required: true, message: 'Please input your first name' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[{ required: true, message: 'Please input!' }]}
                    >
                      <Input.TextArea/>
                    </Form.Item>

                    <Button className="primary-btn primary" htmlType="submit" style={{float: 'right'}} >Save</Button>

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

export default CreateTodo;
