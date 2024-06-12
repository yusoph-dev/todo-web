import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { RootState } from '../../store';

const Redirect = () => {
  const logged_user = useSelector((state: RootState) => state.logged_user);

  return (
    <Navigate to={logged_user ? webRoutes.todos : webRoutes.login} replace />
  );
};

export default Redirect;
