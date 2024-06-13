import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Form, Input, Avatar, BreadcrumbProps, Modal, message , Button, Typography} from 'antd';
const { Text, Title } = Typography;
import React, { useRef, useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import { CiCircleMore } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { Todo } from '../../interfaces/models/todo';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import {
  handleErrorResponse,
  NotificationType,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import Icon, {
  ExclamationCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';


enum ActionKey {
  DELETE = 'delete',
}

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: 0,
      title: 'Todo Management',
    },
    {
      key: webRoutes.todos,
      title: <Text strong>Todos</Text>,
    },
  ],
};


const Todos = () => {
  document.title = 'Todos Management - Todos';
  const actionRef = useRef<ActionType>();
  const [modal, modalContextHolder] = Modal.useModal();
  const [searchText, setSearchText] = useState('');
  const currentState = useSelector((state: RootState) => state.logged_user);
  const [access, setAccess] = useState<any>(currentState?.access);

  const columns: ProColumns[] = [
    {
      title: 'Status',
      dataIndex: 'completed_date',
      sorter: true,
      align: 'center',
      render: (_, row: Todo) => {
        return row.completed_date ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <CloseOutlined style={{ color: 'red' }} />
        );
      }
    },
    {
      title: 'Name',
      dataIndex: 'todo',
      sorter: true,
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: true,
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'Action',
      align: 'center',
      key: 'option',
      fixed: 'right',
      render: (_, row: Todo) => [
        <>
          <Link to={'/todos-management/todos/edit/'+row.id} style={{marginLeft: '10px'}}>
            <Button >Edit</Button>
          </Link>  
          <Button type="primary" onClick={() => {
            handleDeleteTodo(row.id);
          }} style={{marginLeft: '10px'}} danger>
            Delete
          </Button>
          {/* Mark as complete */}
          <Button onClick={() => {
            handleComplete(row.id);
          }} style={{ marginLeft: '10px', marginTop: '10px'}}>
            Mark as {row.completed_date ? 'Incomplete' : 'Complete'}
          </Button>
        </>
      ],
    },
  ];

  useEffect(() => {
    setAccess(currentState?.access)
  }, []);

  const handleDeleteTodo = (todo_id:number) => {
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
          .delete(`${apiRoutes.todo}${todo_id}`)
          .then(() => {
            showNotification(
              'Success',
              NotificationType.SUCCESS,
              'Todo is deleted.'
            );
            actionRef.current?.reload();  
          })
          .catch((error) => {
            handleErrorResponse(error);
          });
      },
      onCancel() { },
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    actionRef.current?.reload();
  };

  const handleComplete = (todo_id:number) => {
    return http
      .put(`${apiRoutes.set_todo}${todo_id}`)
      .then((res) => {
        showNotification(
          'Success',
          NotificationType.SUCCESS,
          res.data.message
        );
        actionRef.current?.reload();  
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  }

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div>
        <Link to={webRoutes.create_todo} style={{float: 'right'}}>
          <Button>Create Todo</Button>
        </Link>
      </div>
      <ProTable
        columns={columns}
        cardBordered={false}
        cardProps={{
          subTitle: 'List of Todos',
          title: <CiCircleMore className="opacity-60" />,
        }}
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
            .get(apiRoutes.todos, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                search: searchText,
                ...sorter
              },
            })
            .then((response) => {
              const todos: [Todo] = response.data.data;

              return {
                data: todos,
                success: true,
                total: response.data.total,
              } as RequestData<Todo>;
            })
            .catch((error) => {

              if (error.response?.status === 400) {
                // Handle 400 error specifically
                const errorMessage = error.response?.data?.message || 'An error occurred.';
                message.error(errorMessage); // Display error message to the user
              } else {
                // Handle other errors
                handleErrorResponse(error); // Use your existing error handling logic
              }

              return {
                data: [],
                success: true,
                total: 0,
              } as RequestData<Todo>;
            });
        }}
        dateFormatter="string"
        search={false}
        rowKey="id"
        options={{
          search: {
            onSearch: (searchText: string) => {
              handleSearch(searchText); 
              return true;
            }
          },

        }}
      />
      {modalContextHolder}
    </BasePageContainer>
  );
};

export default Todos;
