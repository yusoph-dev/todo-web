import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorPage from '../components/errorPage';
import Layout from '../components/layout';
import Redirect from '../components/layout/Redirect';
import NotFoundPage from '../components/notfoundPage';
import { webRoutes } from './web';
import loadable from '@loadable/component';
import ProgressBar from '../components/loader/progressBar';
import RequireAuth from './requireAuth';
import Login from '../components/auth/Login';
import About from '../components/demo-pages/about';

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const Dashboard = loadable(() => import('../components/dashboard'), {
  fallback: fallbackElement,
});
const Users = loadable(() => import('../components/todos'), {
  fallback: fallbackElement,
});

const CreateUser = loadable(() => import('../components/todos/create'), {
  fallback: fallbackElement,
});


const ViewUser = loadable(() => import('../components/todos/view'), {
  fallback: fallbackElement,
});

const EditUser = loadable(() => import('../components/todos/edit'), {
  fallback: fallbackElement,
});



const Access = loadable(() => import('../components/access'), {
  fallback: fallbackElement,
});


export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: errorElement,
  },

  // auth routes
  {
    element: <AuthLayout />,
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.login,
        element: <Login />,
      },
    ],
  },

  // protected routes
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.dashboard,
        element: <Dashboard />,
      },
      {
        path: webRoutes.todos,
        element: <Users />,
      },
      {
        path: webRoutes.create_user,
        element: <CreateUser />,
      },
      {
        path: webRoutes.view_user,
        element: <ViewUser />,
      },
      {
        path: webRoutes.edit_user,
        element: <EditUser />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: errorElement,
  },
]);
