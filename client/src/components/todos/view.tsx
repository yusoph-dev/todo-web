import { Form, Input, Avatar, BreadcrumbProps, Modal, Col, Row, message, Card, Button, Switch, List, Typography } from 'antd';
const { Text, Title } = Typography;
import type { UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/models/user';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import { handleErrorResponse, NotificationType, showNotification } from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import { CheckOutlined, CloseOutlined, AntDesignOutlined } from '@ant-design/icons';
import { set } from 'nprogress';

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

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const ViewUser = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  
  const [user, setUser] = useState<User | null>(null);
  const [manager_to , setManagerTo] = useState([]);
  const [reports_to, setReportsTo] = useState([]);
  const [switchDisabled, setSwitchDisabled] = useState<boolean>(false);
  
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'View User'
    setLoading(true); 
    Promise.all([loadUser()])
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
        title: <Link to={webRoutes.todos}>Users</Link>,
      },
      {
        key: webRoutes.create_user,
        title: <Text strong>{(user?.first_name ? user?.first_name+' '+user?.last_name : 'Loading') || 'Loading'}</Text>,
      }
    ],
  };


  const loadUser = () => {
    return http
      .get(`${apiRoutes.user}${id}`)
      .then((response) => {
        const data = response.data.data;
        setUser(data.user);
        setManagerTo(data.manager_to);
        setReportsTo(data.reports_to);
        setProfileImage(data.user.file_name)
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  const handleDeleteUser = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      className: 'deleteModal',
      content: (
        <p>
          This action cannot be undone. Deleting the user will remove all their
          associated data.
        </p>
      ),
      onOk: async () => {
        return http
          .delete(`${apiRoutes.user}${id}`)
          .then(() => {
            showNotification(
              'Success',
              NotificationType.SUCCESS,
              'User is deleted.'
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
      <div className="loading-indicator">Loading User Data...</div>
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
              <Button>Edit User</Button>
            </Link>
            <Button onClick={handleDeleteUser} style={{color: 'darkred', float: 'right', marginRight: '10px'}}>Delete User</Button>
          </Col>
        </Row>
        <Row gutter={2}> 
          <Col flex={14} style={{ borderRight: '1px solid #fbf0f0', padding: '1vw 2vw'}} >
            <Row style={{padding: '20px'}}> {/* make inside of this row to center, with padding */}
              <Col flex={10} >
                {profileImage ? (
                  <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    src={profileImage}
                    style={{float:'right', marginRight:'30px'}}
                  />
                ) : (
                  <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    icon={<AntDesignOutlined />}
                    style={{float:'right', marginRight:'30px'}}
                  />
                )}
              </Col>
              <Col flex={14}>
                <Title level={3}>{user?.first_name+' '+user?.last_name || 'User'}</Title>
                <Text >{user?.role_name || 'Role'}</Text>
                <br />
                <Text type="secondary">{user?.email || 'Email'}</Text>
              </Col>
            </Row>
            <Col flex={24} style={{paddingLeft: '3vw'}}>
              <Title level={5}>Organizational Structure</Title>
            </Col>
            <Col flex={24} style={{paddingLeft: '5vw'}}>
              <h3>Manager To:</h3>
            </Col>
            <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              
              <Card bordered={true} className="w-full h-full cursor-default custom-card" style={{maxWidth: '500px'}}>
                <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={manager_to}
                    renderItem={(manager:any) => (
                      <List.Item style={{padding: '10px'}}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              shape="circle"
                              size="large"
                              src={
                                <LazyImage
                                  src={manager.file_name}
                                  placeholder={
                                    <div className="bg-gray-100 h-full w-full" />
                                  }
                                />
                              }
                            />
                          }
                          title={`${manager.first_name} ${manager.last_name}`}
                          description={manager.role_name}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
            </Col>
            <Col flex={24} style={{paddingLeft: '5vw'}}>
              <h3>Reports To:</h3>
            </Col>
            <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                
              <Card bordered={true} className="w-full h-full cursor-default custom-card" style={{maxWidth: '500px'}}>
                <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={reports_to}
                    renderItem={(report:any) => (
                      <List.Item style={{padding: '10px'}}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              shape="circle"
                              size="large"
                              src={
                                <LazyImage
                                  src={report.file_name}
                                  placeholder={
                                    <div className="bg-gray-100 h-full w-full" />
                                  }
                                />
                              }
                            />
                          }
                          title={`${report.first_name} ${report.last_name}`}
                          description={report.role_name}
                        />
                      </List.Item>
                    )}
                  />
              </Card>
            </Col>

            <Col flex={24} style={{paddingLeft: '5vw'}}>
              <h3>Job Description</h3>
            </Col>
            
            <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

              <Form variant="filled" style={{ maxWidth: 500 }}>
                <Form.Item
                  name="TextJobDescription"
                  initialValue={user?user.job_description : ''}
                >
                  <Input.TextArea value={'value'}/>
                </Form.Item>
              </Form>

            </Col>

          </Col>
          <Col flex={10} style={{padding: '1vw 2vw'}}>
            <Col flex={24} style={{paddingLeft: '10px'}}>
              <Title level={5}>Admin Controls</Title>
            </Col>
            <Col flex={24}> 
              <Form {...formItemLayout} variant="filled" style={{ maxWidth: 1200 }}>
                <Form.Item name="switch" label="Active User">
                  <Switch
                    className='switches'
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={(user?.is_active == 1)}
                    disabled={switchDisabled}
                    onChange={(checked) => {
                      setSwitchDisabled(true);
                      http
                        .put(`${apiRoutes.update_user_active}${id}`, {
                          is_active: checked,
                        })
                        .then((res) => {
                          setSwitchDisabled(false);
                          showNotification(
                            'Success',
                            NotificationType.SUCCESS,
                            res.data.message
                          );
                        })
                        .catch((error) => {
                          handleErrorResponse(error);
                        });
                      }
                    }
                  />
                </Form.Item>
              </Form>
            </Col>
          </Col>
        </Row>
      </>
    )}
    </BasePageContainer>
  );
};

export default ViewUser;
