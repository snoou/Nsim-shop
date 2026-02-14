import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccessDenied from '../components/AccessDenied'; // کامپوننت بالا رو ایمپورت کن

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && userInfo.isAdmin) {
    // حالت ۱: ادمین است -> بفرما
    return <Outlet />;
  } else if (userInfo && !userInfo.isAdmin) {
    // حالت ۲: لاگین کرده ولی مشتری عادی است -> صفحه عدم دسترسی شیک
    return <AccessDenied />;
  } else {
    // حالت ۳: اصلا لاگین نکرده -> برو لاگین کن
    return <Navigate to='/login' replace />;
  }
};

export default AdminRoute;