import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccessDenied from '../components/AccessDenied'; 

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && userInfo.isAdmin) {
    return <Outlet />;
  } else if (userInfo && !userInfo.isAdmin) {
    return <AccessDenied />;
  } else {
    return <Navigate to='/login' replace />;
  }
};

export default AdminRoute;