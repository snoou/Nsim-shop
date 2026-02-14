import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiBox, FiCheckCircle, FiXCircle, FiClock, FiSettings, FiShoppingBag } from 'react-icons/fi';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.name, userInfo.email]);

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
        toast.success('اطلاعات پروفایل بروزرسانی شد');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="profile-dashboard-wrapper">
      <Container>
        <div className="dashboard-header mb-5">
          <h1 className="dashboard-title">سلام، {userInfo.name} 👋</h1>
          <p className="text-muted">به ناحیه کاربری خود خوش آمدید</p>
        </div>

        <Row className="g-5">
          {/* --- ستون سمت راست: تنظیمات پروفایل (Sidebar) --- */}
          <Col lg={4} xl={3}>
            <div className="profile-sidebar-card">
              <div className="sidebar-header">
                <FiSettings className="icon" />
                <h5>تنظیمات حساب</h5>
              </div>
              
              <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='name'>
                  <Form.Label className="modern-label"><FiUser className="me-2"/> نام کامل</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='نام شما'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="modern-input"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3' controlId='email'>
                  <Form.Label className="modern-label"><FiMail className="me-2"/> ایمیل</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='ایمیل'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="modern-input"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                  <Form.Label className="modern-label"><FiLock className="me-2"/> رمز عبور جدید</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='********'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="modern-input"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-4' controlId='confirmPassword'>
                  <Form.Label className="modern-label">تکرار رمز عبور</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='********'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="modern-input"
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' className='btn-update-profile w-100' disabled={loadingUpdateProfile}>
                  {loadingUpdateProfile ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </Form>
            </div>
          </Col>

          {/* --- ستون سمت چپ: تاریخچه سفارشات --- */}
          <Col lg={8} xl={9}>
            <div className="orders-section">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="section-title"><FiShoppingBag className="me-2 text-accent"/> تاریخچه سفارشات</h2>
                <span className="order-count-badge">{orders ? orders.length : 0} سفارش</span>
              </div>

              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
              ) : (
                <div className="orders-list-container">
                  {orders.length === 0 ? (
                    <Message variant='info'>شما هنوز سفارشی ثبت نکرده‌اید.</Message>
                  ) : (
                    <>
                      {/* نمایش جدولی برای دسکتاپ */}
                      <div className="d-none d-md-block table-responsive-custom">
                        <table className="modern-table w-100">
                          <thead>
                            <tr>
                              <th>شناسه</th>
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
                                <td className="font-monospace text-muted">#{order._id.substring(order._id.length - 6)}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td className="fw-bold">{order.totalPrice.toLocaleString()} تومان</td>
                                <td>
                                  {order.isPaid ? (
                                    <span className="status-pill success"><FiCheckCircle className="me-1"/> پرداخت شده</span>
                                  ) : (
                                    <span className="status-pill danger"><FiXCircle className="me-1"/> ناموفق</span>
                                  )}
                                </td>
                                <td>
                                  {order.isDelivered ? (
                                    <span className="status-pill success"><FiBox className="me-1"/> ارسال شده</span>
                                  ) : (
                                    <span className="status-pill warning"><FiClock className="me-1"/> در حال پردازش</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  <Link to={`/order/${order._id}`} className="btn-details-outline">
                                    جزئیات
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* نمایش کارتی برای موبایل (Mobile View) */}
                      <div className="d-md-none d-flex flex-column gap-3">
                        {orders.map((order) => (
                          <div key={order._id} className="mobile-order-card">
                            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                              <span className="font-monospace text-muted">#{order._id.substring(order._id.length - 6)}</span>
                              <span className="text-muted small">{order.createdAt.substring(0, 10)}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between mb-2">
                              <span>مبلغ کل:</span>
                              <span className="fw-bold">{order.totalPrice.toLocaleString()} تومان</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                              <span>وضعیت پرداخت:</span>
                              {order.isPaid ? (
                                <span className="text-success small fw-bold"><FiCheckCircle/> پرداخت شده</span>
                              ) : (
                                <span className="text-danger small fw-bold"><FiXCircle/> ناموفق</span>
                              )}
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                              <span>وضعیت ارسال:</span>
                              {order.isDelivered ? (
                                <span className="text-success small fw-bold"><FiBox/> ارسال شده</span>
                              ) : (
                                <span className="text-warning small fw-bold"><FiClock/> در حال پردازش</span>
                              )}
                            </div>

                            <Link to={`/order/${order._id}`} className="btn-details-outline w-100 text-center d-block">
                              مشاهده جزئیات سفارش
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileScreen;