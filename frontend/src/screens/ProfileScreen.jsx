import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBox, FiCheckCircle, FiXCircle, FiClock, FiSettings, FiShoppingBag } from 'react-icons/fi';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import '../assets/styles/ProfileScreen.css'; 

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('رمز عبور و تکرار آن مطابقت ندارند');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('اطلاعات پروفایل با موفقیت بروزرسانی شد');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="luxury-profile-wrapper">
      <div className="profile-container">
        
        <div className="profile-welcome-header">
          <h2 className="welcome-title">سلام، {userInfo.name} 👋</h2>
          <p className="welcome-subtitle">به پنل کاربری اختصاصی خود خوش آمدید.</p>
        </div>

        <div className="profile-layout-grid">
          
          <div className="profile-sidebar">
            <div className="dashboard-card">
              <div className="card-header-title">
                <FiSettings className="header-icon" />
                <h3>تنظیمات حساب</h3>
              </div>
              
              <form onSubmit={submitHandler} className="profile-form">
                
                <div className="form-group">
                  <label>نام و نام خانوادگی</label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>آدرس ایمیل</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="form-divider"></div>

                <div className="form-group">
                  <label>تغییر رمز عبور</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      placeholder="رمز عبور جدید"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      placeholder="تکرار رمز عبور جدید"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-save-profile" disabled={loadingUpdateProfile}>
                  {loadingUpdateProfile ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </form>
            </div>
          </div>

          <div className="profile-main-content">
            <div className="dashboard-card">
              <div className="card-header-title space-between">
                <div className="d-flex align-items-center gap-2">
                  <FiShoppingBag className="header-icon" />
                  <h3>سفارش‌های من</h3>
                </div>
                {orders && <span className="orders-count-badge">{orders.length} سفارش</span>}
              </div>

              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
              ) : (
                <>
                  {orders.length === 0 ? (
                    <Message>شما هنوز سفارشی ثبت نکرده‌اید.</Message>
                  ) : (
                    <>
                      <div className="desktop-table-container">
                        <table className="luxury-order-table">
                          <thead>
                            <tr>
                              <th>شماره سفارش</th>
                              <th>تاریخ</th>
                              <th>مبلغ کل</th>
                              <th>وضعیت پرداخت</th>
                              <th>وضعیت ارسال</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id}>
                                <td className="order-id-cell">#{order._id.substring(18)}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td className="fw-bold">{order.totalPrice.toLocaleString()} تومان</td>
                                <td>
                                  {order.isPaid ? (
                                    <span className="status-badge success"><FiCheckCircle/> پرداخت شد</span>
                                  ) : (
                                    <span className="status-badge danger"><FiXCircle/> ناموفق</span>
                                  )}
                                </td>
                                <td>
                                  {order.isDelivered ? (
                                    <span className="status-badge success"><FiBox/> ارسال شد</span>
                                  ) : (
                                    <span className="status-badge warning"><FiClock/> در پردازش</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  <Link to={`/order/${order._id}`} className="btn-view-details">
                                    جزئیات
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mobile-orders-list">
                        {orders.map((order) => (
                          <div key={order._id} className="mobile-order-card">
                            <div className="mobile-order-header">
                                <span className="order-id">سفارش #{order._id.substring(18)}</span>
                                <span className="order-date">{order.createdAt.substring(0, 10)}</span>
                            </div>
                            
                            <div className="mobile-order-row">
                                <span className="row-label">مبلغ کل:</span>
                                <span className="row-value fw-bold">{order.totalPrice.toLocaleString()} تومان</span>
                            </div>
                            
                            <div className="mobile-order-row">
                                <span className="row-label">پرداخت:</span>
                                {order.isPaid ? (
                                    <span className="text-success"><FiCheckCircle/> انجام شده</span>
                                ) : (
                                    <span className="text-danger"><FiXCircle/> ناموفق</span>
                                )}
                            </div>
                            
                            <div className="mobile-order-row">
                                <span className="row-label">ارسال:</span>
                                {order.isDelivered ? (
                                    <span className="text-success"><FiBox/> ارسال شده</span>
                                ) : (
                                    <span className="text-warning"><FiClock/> در پردازش</span>
                                )}
                            </div>
                            
                            <Link to={`/order/${order._id}`} className="btn-view-details-mobile">
                                مشاهده فاکتور و جزئیات
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;