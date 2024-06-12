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
import { User } from '../../interfaces/models/user';
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



const EditUser = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [manager_to , setManagerTo] = useState([]);
  const [reports_to, setReportsTo] = useState([]);

  const [managerUsers , setManagerUsers] = useState([]);
  const [managerReportType , setManagerReportType] = useState(0);

  const [switchDisabled, setSwitchDisabled] = useState<boolean>(false);

  const [roleOption, setRoleOption] = useState([]);
  const [divisionOption, setDivisionOption] = useState([]);
  
  const [openRole, setOpenRole] = useState(false);
  const [openDivision, setOpenDivision] = useState(false);
  const currentState = useSelector((state: RootState) => state.logged_user);
  const { Search } = Input;



  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    document.title = 'Edit User';

    setLoading(true); // Set loading to true before fetch

    Promise.all([loadUser()])
    .then(() => {
      setInitLoading(false);
      setLoading(false); 
    })
    .catch((error) => {
      handleErrorResponse(error);
    });

  }, [id]);

  const [openManageReportsTo, setOpenManagerReportsTo] = useState(false);
  const [confirmLoadingManager, setConfirmLoadingManager] = useState(false);
  const [modalTextManager, setModalTextManager] = useState('Content of the modal');

  const handleOkManager = () => {
    setModalTextManager('The modal will be closed after two seconds');
    setConfirmLoadingManager(true);
    setTimeout(() => {
      setOpenManagerReportsTo(false);
      setConfirmLoadingManager(false);
    }, 2000);
  };
  
  const handleCancelManager = () => {
    setOpenManagerReportsTo(false);
  };

  const onAddManagerReportsTo = (type: number) => {
    setManagerReportType(type)
    setOpenManagerReportsTo(true);
    loadManagerOrReports('', type)
  };
  
  const onSearchManager: SearchProps['onSearch'] = (value, _e, info) => {
    
    setLoading(true);
    loadManagerOrReports(value, managerReportType)
  };
  
  const loadManagerOrReports = (value:any, type = managerReportType) => {
    
    setLoading(true);
    return http
      .post(`${apiRoutes.manager_reports_to}`, {id, value, type})
      .then((response) => {
        // const user_data = response.data.data;
        setManagerUsers(response.data); // Set user state directly
        setLoading(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

    
  const onAddReportsTo = () => {
    // setLoading(true);
    setOpenManagerReportsTo(true);
    setLoading(true);

  };

  const setManageOrReportsTo = (set_id:number, type = managerReportType, set = 'add') => {
    
    setLoading(true);

    return http
    .post(`${apiRoutes.set_manager_reports_to}`, { id, set_id, type, set})
    .then((response) => {
      setLoading(false);
      loadUser()
      loadManagerOrReports('', type)
      // const user_data = response.data.data;
      // setManagerUsers(response.data); // Set user state directly
    })
    .catch((error) => {
      handleErrorResponse(error);
    });

  }


  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: `${apiRoutes.user_upload_profile}${id}`,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        setLoading(true)
      }
      if (status === 'done') {
        setLoading(false)
        message.success(`${info.file.name} Image uploaded successfully.`);

        const uploadedFile = info.file.response; 
        const imageUrl = uploadedFile.img_url; 

        setProfileImage(imageUrl);
      } else if (status === 'error') {
        message.error(`${info.file.name} Image upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    headers: { // Add a new headers property
      Authorization: `Bearer ${currentState?.token}`, // Include JWT token
    }
  };
  

  const addManagerTo =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <a onClick={() => onAddManagerReportsTo(0)}>Add Manager to</a>
      </div>
    ) : null;

  const addReportsTo =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <a onClick={() => onAddManagerReportsTo(1)}>Add Reports to</a>
      </div>
    ) : null;

  const loadUser = () => {
    
    setLoading(true);
    return http
      .get(`${apiRoutes.user}${id}`)
      .then((response) => {
        const data = response.data.data;
        setUser(data.user);
        setManagerTo(data.manager_to);
        setReportsTo(data.reports_to);
        setRoleOption(data.role_options);
        setDivisionOption(data.division_options);
        setProfileImage(data.user.file_name);
        setIsActive(data.user.is_active == 1 ? true : false);
        setLoading(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };
  // const [modal, modalContextHolder] = Modal.useModal();
  // const [searchText, setSearchText] = useState('');


  const handleActionOnSelect = (key: string, user: User) => {
    // if (key === ActionKey.DELETE) {
    //   showDeleteConfirmation(user);
    // }
  };

  const showDeleteConfirmation = (user: User) => {
    // modal.confirm({
    //   title: 'Are you sure to delete this user?',
    //   icon: <ExclamationCircleOutlined />,
    //   content: (
    //     <ProDescriptions column={1} title=" ">
    //       <ProDescriptions.Item valueType="avatar" label="Avatar">
    //         {user.avatar}
    //       </ProDescriptions.Item>
    //       <ProDescriptions.Item valueType="text" label="Name">
    //         {user.first_name} {user.last_name}
    //       </ProDescriptions.Item>
    //       <ProDescriptions.Item valueType="text" label="Email">
    //         {user.email}
    //       </ProDescriptions.Item>
    //     </ProDescriptions>
    //   ),
    //   okButtonProps: {
    //     className: 'bg-primary',
    //   },
    //   onOk: () => {
    //     return http
    //       .delete(`${apiRoutes.users}/${user.id}`)
    //       .then(() => {
    //         showNotification(
    //           'Success',
    //           NotificationType.SUCCESS,
    //           'User is deleted.'
    //         );

    //         actionRef.current?.reloadAndRest?.();
    //       })
    //       .catch((error) => {
    //         handleErrorResponse(error);
    //       });
    //   },
    // });
  };

  const handleSearch = (value: string) => {
    // setSearchText(value);
    // actionRef.current?.reload();
  };


  const handleChangeDivision = (value: string[]) => {
  };

  const handleSubmit = (values: any) => {
    
    return http
      .put(`${apiRoutes.update_user}${id}`, values)
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
        title: <Link to={webRoutes.todos}>Users</Link>,
      },
      {
        key: webRoutes.edit_user,
        title: <Text strong>Edit - {(user?.first_name ? user?.first_name+' '+user?.last_name : 'User') || 'User'}</Text>,
      }
    ],
  };

  
  const handleSelectClickRole = (event?: React.MouseEvent<HTMLDivElement>) => {
    event?.currentTarget.classList.add('clicked');
    setOpenRole(!openRole)
  };
  
  const handleSelectClickDivision = (event?: React.MouseEvent<HTMLDivElement>) => {
    event?.currentTarget.classList.add('clicked');
    setOpenDivision(!openDivision)
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Modal
        className='modalManageReportsTo'
        title={managerReportType ? ( "Set Reporting To" ) : ( "Set Managing To" )}
        open={openManageReportsTo}
        onOk={handleOkManager}
        confirmLoading={confirmLoadingManager}
        onCancel={handleCancelManager}
        footer={null}
        width={800}
      >
        <Col flex={24} style={{paddingLeft: '10px', margin: '10px 0'}}>
          <h3>Currently {managerReportType ? ( 'Reports' ) : ( 'Managing' )} to:</h3>
        </Col>
        <Col flex={24} style={{paddingLeft: '10px', margin: '10px 0', textAlign: 'center'}}>
          {(managerReportType ? reports_to.length : manager_to.length) > 0 ? (
            <Avatar.Group
              maxCount={20}
              size="large"
              maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            >
              {(managerReportType ? reports_to : manager_to).map((user:any, index) => (
                <Tooltip key={index} title={user?.first_name + ' ' + user?.last_name} placement="top">  {/* Customize tooltip title */}
                  <Avatar src={user?.file_name} />  {/* Set default avatar if no URL provided */}
                </Tooltip>
              ))}
            </Avatar.Group>
          ) : (
            <b>No users currently being {managerReportType ? ( 'Reports to' ) : ( 'Managed' )}.</b>
          )}
        </Col>
        
        <Col flex={24} style={{paddingLeft: '10px', margin: '10px 0'}}>
          <h3>Search {managerReportType ? ( 'Reports' ) : ( 'Managed' )} to:</h3>
        </Col>
        
        <Col flex={24} style={{paddingLeft: '10px', margin: '10px 0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Search placeholder="input search text" allowClear onSearch={onSearchManager} style={{ width: '60%' }} />
        </Col>

        <Col flex={24} style={{padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            
          <Card bordered={true} className="w-full h-full cursor-default custom-card" style={{maxWidth: '550px'}}>
            <List
                loading={loading}
                itemLayout="horizontal"
                // loadMore={addReportsTo}
                dataSource={managerUsers}
                renderItem={(manager:any) => (
                  <List.Item style={{padding: '10px'}}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="circle"
                          size="large"
                          src={
                            <LazyImage
                              src={manager?.file_name}
                              placeholder={
                                <div className="bg-gray-100 h-full w-full" />
                              }
                            />
                          }
                        />
                      }
                      title={`${manager?.first_name} ${manager?.last_name}`}
                      description={manager?.role_name}
                    />
                    <Button className='' onClick={() => setManageOrReportsTo(manager.id, managerReportType)} disabled={loading}>Add {managerReportType ? ( 'to Reporting' ) : ( 'to Manage' )}</Button>
                  </List.Item>
                )}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Search user to manage" /> }}
              />
          </Card>
        </Col>
      </Modal>

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
          <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}> {/* make inside of this row to center, with padding */}
            <Dragger {...props} style={{width: '200px'}} className='dragger-image' disabled={loading}>
              {profileImage ? (
                <img src={profileImage} alt="Profile Picture" />
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined />
                  </p>
                  <p className="ant-upload-hint">
                    Click or drag <br></br>file to upload<br></br>Profile Picture
                  </p>
                </>
              )}
            </Dragger>
          </Col>
          <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            
            {!loading ? (
              // Render UI components
                  <Form 
                    {...formItemLayout} 
                    variant="filled" 
                    style={{ maxWidth: 1200, width: '100%' }} 
                    onFinish={handleSubmit}
                    initialValues={user ? user : []}
                    >

                    <Form.Item
                      label="First Name"
                      name="first_name"
                      rules={[{ required: true, message: 'Please input your first name' }]}
                    >
                      <Input />
                    </Form.Item>
              
                    <Form.Item
                      label="Middle Name"
                      name="middle_name"
                    >
                      <Input />
                    </Form.Item>
              
                    <Form.Item
                      label="Last Name"
                      name="last_name"
                      rules={[{ required: true, message: 'Please input your last name' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true, message: 'Please input your email' }]}
                    >
                      <Input />
                    </Form.Item>

                    {/* Add other Form.Item components as needed */}
                    
                    <Form.Item
                      label="Job Title"
                      name="role_name"
                      rules={[{ required: true, message: 'Please input your role name' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Division"
                      name="assigned_branch"
                      rules={[{ required: true, message: 'Please select division' }]}
                    >
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Select Assigned Branch"
                        onChange={handleChangeDivision}
                        options={divisionOption}
                        open={openDivision}
                        onClick={handleSelectClickDivision}
                        maxCount={1} 
                      />
                    </Form.Item>


                    <Form.Item
                      label="Job Description"
                      name="job_description"
                      rules={[{ required: true, message: 'Please input!' }]}
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
        <Col flex={10} style={{padding: '1vw 2vw'}}>
          <Col flex={24} style={{paddingLeft: '10px'}}>
            <Title level={5}>Admin Controls</Title>
          </Col>
          <Col flex={24}> 
            <Form {...formItemLayout} variant="filled" style={{ maxWidth: 1200 }}>
              {/* <Form.Item name="switch_admin" label="Admin Access" >
                <Switch
                  className='switches'
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
              <Form.Item name="switch_manager" label="Manager Access">
                <Switch
                  className='switches'
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item> */}
              <Form.Item name="switch_active" label="Active User" >
                <Switch
                  className='switches'
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={isActive}
                  disabled={switchDisabled}
                  onChange={(checked) => {
                    setSwitchDisabled(true);
                    setIsActive(!isActive)
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
                  }}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col flex={24} style={{paddingLeft: '10px'}}>
            <Title level={5}>Organizational Structure</Title>
          </Col>
          <Col flex={24} style={{paddingLeft: '10px'}}>
            <h3>Manager To:</h3>
          </Col>
          <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>  
            <Card bordered={true} className="w-full h-full cursor-default custom-card" style={{maxWidth: '450px'}}>
              <List
                  loading={loading}
                  itemLayout="horizontal"
                  loadMore={addManagerTo}
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
                      <a className='' onClick={() => setManageOrReportsTo(manager.id, 0, 'remove')}>Remove</a>
                    </List.Item>
                  )}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Not currently managing, Click Add Manager To" /> }}
                />
            </Card>
          </Col>
          <Col flex={24} style={{paddingLeft: '10px'}}>
            <h3>Reports To:</h3>
          </Col>
          <Col flex={24} style={{padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              
            <Card bordered={true} className="w-full h-full cursor-default custom-card" style={{maxWidth: '450px'}}>
              <List
                  loading={loading}
                  itemLayout="horizontal"
                  loadMore={addReportsTo}
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
                      <a className='' onClick={() => setManageOrReportsTo(report.id, 1, 'remove')}>Remove</a>
                    </List.Item>
                  )}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Not currently reporting, Click Add Reports To" /> }}
                />
            </Card>
          </Col>
        </Col>
      </Row>
    </BasePageContainer>
  );
};

export default EditUser;
