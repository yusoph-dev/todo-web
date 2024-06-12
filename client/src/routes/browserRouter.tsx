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

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const Todos = loadable(() => import('../components/todos/'), {
  fallback: fallbackElement,
});

const CreateTodo = loadable(() => import('../components/todos/create'), {
  fallback: fallbackElement,
});


const ViewTodo = loadable(() => import('../components/todos/view'), {
  fallback: fallbackElement,
});

const EditTodo = loadable(() => import('../components/todos/edit'), {
  fallback: fallbackElement,
});



export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: errorElement,
  },

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
        path: webRoutes.todos,
        element: <Todos />,
      },
      {
        path: webRoutes.create_todo,
        element: <CreateTodo />,
      },
      {
        path: webRoutes.view_todo,
        element: <ViewTodo />,
      },
      {
        path: webRoutes.edit_todo,
        element: <EditTodo />,
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
