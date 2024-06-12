import { Form, Input, Avatar, BreadcrumbProps, Modal, Col, Row, message, Card, Button, Switch, List, Typography } from 'antd';
const { Text, Title } = Typography;
import type { UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Todo } from '../../interfaces/models/todo';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import { handleErrorResponse, NotificationType, showNotification } from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};


const ViewTodo = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  
  const [todo, setTodo] = useState<Todo | null>(null);
  
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'View Todo'
    setLoading(true); 
    Promise.all([loadTodo()])
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  }, []);

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
        key: webRoutes.create_todo,
        title: <Text strong>{(todo?.todo ? todo?.todo : 'Loading') || 'Loading'}</Text>,
      }
    ],
  };


  const loadTodo = () => {
    return http
      .get(`${apiRoutes.todo}${id}`)
      .then((response) => {
        const data = response.data.data;
        setTodo(data.todo);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  const handleDeleteTodo = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this todo?',
      className: 'deleteModal',
      content: (
        <p>
          This action cannot be undone. Deleting the todo will remove all their
          associated data.
        </p>
      ),
      onOk: async () => {
        return http
          .delete(`${apiRoutes.todo}${id}`)
          .then(() => {
            showNotification(
              'Success',
              NotificationType.SUCCESS,
              'Todo is deleted.'
            );

            navigate('/todos-management/todos/');
          })
          .catch((error) => {
            handleErrorResponse(error);
          });
      },
      onCancel() {}, 
    });
  };


  return (
    <BasePageContainer breadcrumb={breadcrumb}>
    {loading ? (
      <div className="loading-indicator">Loading Todo Data...</div>
    ) : (
      <>
        <Row gutter={2} style={{ justifyContent: 'flex-end' }}>
          <Col flex={12} style={{justifyContent: 'flex-end'}}>
              <Title level={5}>View Todo</Title>
          </Col>
          <Col flex={12} style={{justifyContent: 'flex-end'}}>
            <Link to={webRoutes.todos} style={{float: 'right'}}>
              <Button>Back to List of Todos</Button>
            </Link>
            <Link to={'/todos-management/todos/edit/'+id} style={{float: 'right', marginRight: '10px'}}>
              <Button>Edit Todo</Button>
            </Link>
            <Button onClick={handleDeleteTodo} style={{color: 'darkred', float: 'right', marginRight: '10px'}}>Delete Todo</Button>
          </Col>
        </Row>
        <Row gutter={2}> 
          <Col flex={24} style={{ borderRight: '1px solid #fbf0f0', padding: '1vw 2vw'}} >
            <Row style={{padding: '20px'}}> {/* make inside of this row to center, with padding */}
              <Col flex={24}>
                <Title level={3}>{todo?.todo || 'Todo'}</Title>
                <Text >{todo?.description || 'Description'}</Text>
              </Col>
            </Row>

          </Col>
        </Row>
      </>
    )}
    </BasePageContainer>
  );
};

export default ViewTodo;
