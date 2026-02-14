import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa'; // آیکون‌های استاندارد
import { FiUser, FiShield, FiMail, FiCheck, FiX } from 'react-icons/fi'; // آیکون‌های مدرن
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      try {
        await deleteUser(id);
        refetch();
        toast.success('کاربر با موفقیت حذف شد');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="admin-user-list-wrapper">
      {/* هدر صفحه */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="admin-page-title">لیست کاربران</h1>
          <p className="text-muted small mb-0">مدیریت مشتریان و مدیران سایت</p>
        </div>
        <span className="user-count-badge">
          {users ? users.length : 0} <FiUser className="ms-1"/>
        </span>
      </div>

      {loadingDelete && <Loader />}
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="table-responsive-custom">
          <table className="admin-fashion-table">
            <thead>
              <tr>
                <th>کاربر</th>
                <th>ایمیل</th>
                <th>نقش کاربری</th>
                <th className="text-center">شناسه</th>
                <th className="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {/* نام و آواتار */}
                  <td data-label="کاربر">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`user-avatar-small ${user.isAdmin ? 'admin-ring' : ''}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="fw-bold text-dark">{user.name}</div>
                    </div>
                  </td>
                  
                  {/* ایمیل */}
                  <td data-label="ایمیل">
                    <a href={`mailto:${user.email}`} className="user-email-link">
                      <FiMail className="me-2 text-muted"/>
                      {user.email}
                    </a>
                  </td>

                  {/* نقش (ادمین یا مشتری) */}
                  <td data-label="نقش">
                    {user.isAdmin ? (
                      <span className="role-pill admin">
                        <FiShield className="me-1"/> مدیر کل
                      </span>
                    ) : (
                      <span className="role-pill customer">
                        <FiUser className="me-1"/> مشتری
                      </span>
                    )}
                  </td>

                  {/* شناسه (فقط ۴ رقم آخر برای زیبایی) */}
                  <td data-label="شناسه" className="text-center">
                    <span className="id-pill-small">
                      ...{user._id.substring(user._id.length - 6)}
                    </span>
                  </td>

                  {/* دکمه‌ها */}
                  <td data-label="عملیات" className="text-center">
                    {!user.isAdmin ? (
                      <div className="action-buttons">
                        <Link 
                          to={`/admin/user/${user._id}/edit`} 
                          className="btn-icon-edit"
                          title="ویرایش"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn-icon-delete"
                          onClick={() => deleteHandler(user._id)}
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small" title="امکان حذف مدیر وجود ندارد">
                        <FiShield size={18} color="#ccc"/>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListScreen;