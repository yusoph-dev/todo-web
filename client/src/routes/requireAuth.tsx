import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../store';
import { webRoutes } from './web';

export type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const logged_user = useSelector((state: RootState) => state.logged_user);
  const location = useLocation();

  if (!logged_user) {
    return <Navigate to={webRoutes.login} state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
