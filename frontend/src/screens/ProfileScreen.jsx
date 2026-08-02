import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiBox, FiCheckCircle, FiXCircle, FiClock, FiSettings, FiShoppingBag, FiChevronLeft } from 'react-icons/fi';

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
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

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
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          background-color: #f8f9fa;
          min-height: 90vh;
          padding: 2rem 0;
          font-family: 'Vazirmatn', sans-serif;
        }
        .dashboard-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #eee;
          box-shadow: 0 5px 20px rgba(0,0,0,0.02);
          padding: 2rem;
          height: 100%;
        }
        .form-control-custom {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 0.8rem 1rem;
          transition: all 0.3s;
        }
        .form-control-custom:focus {
          background-color: #fff;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
        }
        .btn-black {
          background-color: #1a1a1a;
          color: #fff;
          border-radius: 12px;
          padding: 0.8rem;
          font-weight: 600;
          border: none;
          transition: all 0.3s;
        }
        .btn-black:hover {
          background-color: #333;
          transform: translateY(-2px);
        }
        .order-table th {
          font-weight: 600;
          color: #666;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 1rem;
        }
        .order-table td {
          vertical-align: middle;
          padding: 1rem 0.5rem;
          color: #333;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .status-success { background: #e6f9ed; color: #28a745; }
        .status-danger { background: #ffebee; color: #dc3545; }
        .status-warning { background: #fff8e1; color: #ffc107; }
        
        .mobile-order-card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
      `}</style>

      <Container>
        <div className="mb-4">
          <h2 className="fw-bold">سلام، {userInfo.name} 👋</h2>
          <p className="text-muted">به پنل کاربری خوش آمدید</p>
        </div>

        <Row className="g-4">
          {/* --- ستون سمت راست: ویرایش پروفایل --- */}
          <Col lg={4} xl={3}>
            <div className="dashboard-card">
              <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                <FiSettings size={20} style={{color: '#1a1a1a'}} />
                <h5 className="mb-0 fw-bold" style={{color: '#1a1a1a'}}>تنظیمات حساب</h5>
              </div>
              
              <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='name'>
                  <Form.Label className="text-muted small">نام و نام خانوادگی</Form.Label>
                  <Form.Control
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control-custom"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3' controlId='email'>
                  <Form.Label className="text-muted small">آدرس ایمیل</Form.Label>
                  <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control-custom"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                  <Form.Label className="text-muted small">تغییر رمز عبور</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='رمز جدید'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control-custom"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='mb-4' controlId='confirmPassword'>
                  <Form.Control
                    type='password'
                    placeholder='تکرار رمز جدید'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control-custom"
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' className='btn-black w-100' disabled={loadingUpdateProfile}>
                  {loadingUpdateProfile ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </Form>
            </div>
          </Col>

          {/* --- ستون سمت چپ: سفارشات --- */}
          <Col lg={8} xl={9}>
            <div className="dashboard-card">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                    <FiShoppingBag size={20} />
                    <h4 className="mb-0 fw-bold">سفارش‌های من</h4>
                </div>
                {orders && <span className="badge bg-light text-dark rounded-pill px-3 py-2">{orders.length} سفارش</span>}
              </div>

              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
              ) : (
                <>
                  {orders.length === 0 ? (
                    <Message variant='info'>شما هنوز سفارشی ثبت نکرده‌اید.</Message>
                  ) : (
                    <>
                      {/* نمایش جدولی برای دسکتاپ */}
                      <div className="d-none d-md-block table-responsive">
                        <table className="table table-borderless order-table w-100">
                          <thead>
                            <tr>
                              <th>شماره سفارش</th>
                              <th>تاریخ</th>
                              <th>مبلغ کل</th>
                              <th>پرداخت</th>
                              <th>وضعیت</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id}>
                                <td className="text-muted font-monospace">#{order._id.substring(order._id.length - 6)}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td className="fw-bold">{order.totalPrice.toLocaleString()} تومان</td>
                                <td>
                                  {order.isPaid ? (
                                    <span className="status-badge status-success"><FiCheckCircle/> پرداخت شد</span>
                                  ) : (
                                    <span className="status-badge status-danger"><FiXCircle/> ناموفق</span>
                                  )}
                                </td>
                                <td>
                                  {order.isDelivered ? (
                                    <span className="status-badge status-success"><FiBox/> ارسال شد</span>
                                  ) : (
                                    <span className="status-badge status-warning"><FiClock/> در پردازش</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-dark rounded-pill px-3">
                                    جزئیات
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* نمایش کارتی برای موبایل */}
                      <div className="d-md-none">
                        {orders.map((order) => (
                          <div key={order._id} className="mobile-order-card">
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                <span className="text-muted font-monospace">#{order._id.substring(order._id.length - 6)}</span>
                                <span className="text-muted small">{order.createdAt.substring(0, 10)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>مبلغ:</span>
                                <span className="fw-bold">{order.totalPrice.toLocaleString()} تومان</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>وضعیت پرداخت:</span>
                                {order.isPaid ? (
                                    <span className="text-success small fw-bold">پرداخت شده</span>
                                ) : (
                                    <span className="text-danger small fw-bold">ناموفق</span>
                                )}
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>وضعیت سفارش:</span>
                                {order.isDelivered ? (
                                    <span className="text-success small fw-bold">ارسال شده</span>
                                ) : (
                                    <span className="text-warning small fw-bold">در حال پردازش</span>
                                )}
                            </div>
                            <Link to={`/order/${order._id}`} className="btn btn-dark w-100 rounded-pill">
                                مشاهده جزئیات
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileScreen;