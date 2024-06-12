import { Button, Form, Input, Col } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { apiRoutes } from '../../routes/api';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/logged_userSlice';
import { RootState } from '../../store';
import { useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { handleErrorResponse, setPageTitle } from '../../utils';
import { LoggedUser } from '../../interfaces/models/logged_user';
import { defaultHttp } from '../../utils/http';


interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || webRoutes.todos;
  const logged_user = useSelector((state: RootState) => state.logged_user);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setPageTitle('Todo Login');
    if (logged_user) {
      navigate(from, { replace: true });
    }
  }, [logged_user]);

  const onSubmit = (values: FormValues) => {
    setLoading(true);
    
    defaultHttp
      .post(apiRoutes.login, {
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        const data = response.data;
        const logged_user = {
          token: data.token,
          email: data.email,
          file_name:data.file_name,
          first_name:data.first_name,
          last_name:data.last_name,
          menu:data.menu,
          role:data.role,
          user_id:data.user_id,
          access:data.access
        };
        dispatch(login(logged_user));
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
        Todo Login
      </h1>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="login"
        onFinish={onSubmit}
        layout={'vertical'}
        requiredMark={false}
        initialValues={
          import.meta.env.VITE_DEMO_MODE === 'true'
            ? {
                email: 'test@email.com',
                password: 'password',
              }
            : {}
        }
      >
        <div>
          <Form.Item
            name="email"
            label={
              <p className="block text-sm font-medium text-gray-900">Email</p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your email',
              },
              {
                type: 'email',
                message: 'Invalid email address',
              },
            ]}
          >
            <Input
              placeholder="name@example.com"
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="password"
            label={
              <p className="block text-sm font-medium text-gray-900">
                Password
              </p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              visibilityToggle={false}
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>

        <div className="text-center">
          <Button
            className="mt-4 bg-primary"
            block
            loading={loading}
            type="primary"
            size="large"
            htmlType={'submit'}
          >
            Login
          </Button>
        </div>
      </Form>

    </Fragment>
  );
};

export default Login;
