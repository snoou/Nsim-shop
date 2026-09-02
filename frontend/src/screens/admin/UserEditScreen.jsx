import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiUser, FiMail, FiShield, FiArrowRight, FiSave, FiCheckCircle } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';
import '../../assets/styles/UserEditScreen.css';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin }).unwrap();
      toast.success('اطلاعات کاربر با موفقیت به‌روزرسانی شد');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const userInitial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-container">
        
        <div className="admin-header-flex">
          <div>
            <h1 className="admin-page-title">ویرایش کاربر</h1>
            <p className="admin-page-subtitle">مدیریت اطلاعات هویتی و سطح دسترسی</p>
          </div>
          <Link to='/admin/userlist' className="btn-back-minimal">
            بازگشت <FiArrowRight size={18} />
          </Link>
        </div>

        {loadingUpdate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <form onSubmit={submitHandler} className="edit-user-form">
            <div className="edit-grid-layout">
              
              <div className="edit-sidebar">
                <div className="admin-card text-center profile-summary-card">
                  <div className="user-avatar-large">
                    {userInitial}
                  </div>
                  <h3 className="profile-name">{name || 'کاربر جدید'}</h3>
                  <p className="profile-email">{email || 'email@example.com'}</p>
                  
                  <div className={`role-badge ${isAdmin ? 'admin' : 'customer'}`}>
                    {isAdmin ? 'مدیر کل (Admin)' : 'مشتری (Customer)'}
                  </div>
                </div>
              </div>

              <div className="edit-main-content">
                <div className="admin-card">
                  <h3 className="card-section-title mb-4">اطلاعات کاربری</h3>
                  
                  <div className="minimal-input-group mb-4">
                    <label><FiUser className="icon-label" /> نام و نام خانوادگی</label>
                    <input
                      type="text"
                      placeholder="نام کامل کاربر..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="minimal-input"
                      required
                    />
                  </div>

                  <div className="minimal-input-group mb-4">
                    <label><FiMail className="icon-label" /> آدرس پست الکترونیک</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="minimal-input ltr-align"
                      required
                    />
                  </div>

                  <div className="minimal-input-group mb-4">
                    <label><FiShield className="icon-label" /> سطح دسترسی در سیستم</label>
                    <div 
                      className={`admin-role-toggle-card ${isAdmin ? 'active' : ''}`}
                      onClick={() => setIsAdmin(!isAdmin)}
                    >
                      <div className="role-card-content">
                        <div className="role-icon-box">
                          <FiShield size={24} />
                        </div>
                        <div className="role-text-content">
                          <h6 className="role-title">دسترسی مدیریت (Admin)</h6>
                          <p className="role-desc">قابلیت دسترسی به پنل ادمین، ویرایش محصولات و مدیریت سفارشات کاربران.</p>
                        </div>
                      </div>
                      <div className="role-checkbox">
                        {isAdmin ? <FiCheckCircle size={22} className="text-teal" /> : <div className="empty-circle"></div>}
                      </div>
                    </div>
                  </div>

                  <div className="form-action-footer">
                    <button 
                      type="submit" 
                      className="btn-submit-solid"
                      disabled={loadingUpdate}
                    >
                      <FiSave size={20} />
                      {loadingUpdate ? 'در حال ثبت...' : 'ذخیره تغییرات'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditScreen;