import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Modal, Space, Button, Form, Input, message } from 'antd';
import { useRef } from 'react';
import { CiCircleMore } from 'react-icons/ci';
import { User } from '../../interfaces/models/user';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import React, { useState } from 'react';
import {
  handleErrorResponse,
  NotificationType,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import Icon, {
  ExclamationCircleOutlined,
  DeleteOutlined,
  FormOutlined
} from '@ant-design/icons';

enum ActionKey {
  DELETE = 'delete',
  UPDATE = 'update'
}

const Permissions = () => {
  const actionRef = useRef<ActionType>();
  const [modal, modalContextHolder] = Modal.useModal();

  const [permissionVisible, setPermissionModalVisible] = useState(false);
  const [deleteVisible, setDeleteModalVisible] = useState(false);
  const [permissionName, setPermissionName] = useState('');
  const [titleName, setTitleName] = useState('Create');
  const [buttonLabel, setButtonLabel] = useState('Save');
  const [currentID, setCurrentId] = useState(null);
  const [searchText, setSearchText] = useState('');


  const handleOpenModal = () => {
    setPermissionModalVisible(true);
    setTitleName('Create')
    setButtonLabel('Save')
    setCurrentId(null)
    setPermissionName('');
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const handleCloseModal = () => {
    setPermissionModalVisible(false);
    setPermissionName('');
  };

  const handleInputChange = (event:any) => {
    setPermissionName(event.target.value);
  };

  const handleSavePermission = () => {

    if(permissionName == ''){
      message.error('Please insert permission name');
    }
    else{

      return http
        .post(`${(currentID == null ? apiRoutes.create_permission : apiRoutes.update_permission)}`, {name: permissionName, id: currentID})
        .then((response) => {
          actionRef.current?.reload();
          setPermissionName('');
          handleCloseModal();
          message.success(response.data.message);
        })
        .catch((error) => {
          handleErrorResponse(error);
        });
    }
  };

  const columns: ProColumns[] = [
    {
      title: 'Permission Name',
      dataIndex: 'name',
      sorter: true,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Created by',
      dataIndex: 'created_name',
      sorter: true,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      sorter: true,
      align: 'center',
      ellipsis: true,
    },
    // {
    //   title: 'Action',
    //   align: 'center',
    //   key: 'option',
    //   fixed: 'right',
    //   render: (_, row: User) => [
    //     <TableDropdown
    //       key="actionGroup"
    //       onSelect={(key) => handleActionOnSelect(key, row)}
    //       menus={[
    //         {
    //           // key: ActionKey.DELETE,
    //           key: '',
    //           name: (
    //             <Space>
    //               <DeleteOutlined />
    //               Delete
    //             </Space>
    //           ),
    //         },
    //         {
    //           // key: ActionKey.UPDATE,
    //           key: '',
    //           name: (
    //             <Space aria-disabled>
    //               <FormOutlined />
    //               Update
    //             </Space>
    //           ),
    //         },
    //       ]}
    //     >
    //       <Icon component={CiCircleMore} className="text-primary text-xl" />
    //     </TableDropdown>,
    //   ],
    // },
  ];

  const handleActionOnSelect = (key: string, permission: any) => {
    if (key === ActionKey.DELETE) {
      setDeleteModalVisible(true);

      setPermissionName(permission.name);
      setCurrentId(permission.id)
    }
    if (key === ActionKey.UPDATE) {

      setPermissionModalVisible(true);
      setPermissionName(permission.name);

      setTitleName('Update')
      setButtonLabel('Update')
      setCurrentId(permission.id)
    }
  };

  const handleDeletePermission = () => {
    return http
      .delete(`${apiRoutes.delete_permission}${currentID}`)
      .then((response) => {
        showNotification(
          'Success',
          NotificationType.SUCCESS,
          'Permission is deleted.'
        );

        actionRef.current?.reloadAndRest?.();
        setPermissionName('');
        handleCloseDeleteModal();
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          // Handle 400 error specifically
          const errorMessage = error.response?.data?.message || 'An error occurred.';
          message.error(errorMessage); // Display error message to the user
          setPermissionName('');
          handleCloseDeleteModal();
        } else {
          // Handle other errors
          handleErrorResponse(error); // Use your existing error handling logic
        }
      });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    actionRef.current?.reload();
  };

  return (
    <>
      <div>
        <Button style={{ float: 'right' }} disabled>Create Permission</Button>
        {/* <Button onClick={handleOpenModal} style={{ float: 'right' }} disabled>Create Permission</Button> */}
      </div>
      <Modal
        title={titleName+" Permission"}
        open={permissionVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSavePermission}>
            {buttonLabel}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Permission Name" >
            <Input value={permissionName} onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Are you sure to delete this permission?'
        open={deleteVisible}
        onCancel={handleCloseDeleteModal}
        // icon={<ExclamationCircleOutlined />}
        footer={[
          <Button key="back" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleDeletePermission}>
            Delete Permission
          </Button>,
        ]}
      >
        <ProDescriptions column={1} title=" ">
          <ProDescriptions.Item valueType="text" label="Permission Name">
            {permissionName}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Modal>

      <ProTable
        columns={columns}
        cardBordered={false}
        bordered={true}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={'fixed'}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        actionRef={actionRef}
        request={(params, sorter) => {
          return http
            .get(apiRoutes.permissions, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                search: searchText,
                ...sorter
              },
            })
            .then((response) => {
              const permissions = response.data.data;

              return {
                data: permissions,
                success: true,
                total: response.data.total,
              } as RequestData<User>;
            })
            .catch((error) => {
              handleErrorResponse(error);

              return {
                data: [],
                success: false,
              } as RequestData<User>;
            });
        }}
        dateFormatter="string"
        search={false}
        rowKey="id"
        options={{
          search: {
            onSearch: (text:string) => {
              setSearchText(text)
              return true;
            }
          },
        }}
      />
    </>
  );
};

export default Permissions;
