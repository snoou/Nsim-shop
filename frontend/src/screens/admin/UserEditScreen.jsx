import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FiUser, FiMail, FiShield, FiArrowRight, FiSave, FiCheckCircle } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

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
      toast.success('اطلاعات کاربر با موفقیت بروزرسانی شد');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // گرفتن حرف اول اسم برای آواتار
  const userInitial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="admin-edit-wrapper">
      <Container>
        {/* هدر صفحه */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="edit-page-title">ویرایش کاربر</h1>
            <p className="text-muted small mb-0">مدیریت دسترسی و اطلاعات شخصی</p>
          </div>
          <Link to='/admin/userlist' className="btn-back-outline">
            <FiArrowRight /> بازگشت
          </Link>
        </div>

        {loadingUpdate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="user-edit-card shadow-sm">
            <Form onSubmit={submitHandler}>
              <Row className="g-5 align-items-center">
                
                {/* ستون آواتار (سمت راست/بالا) */}
                <Col md={4} className="text-center border-end-md">
                  <div className="user-avatar-large mb-3">
                    {userInitial}
                  </div>
                  <h4 className="fw-bold mb-1">{name || 'کاربر جدید'}</h4>
                  <p className="text-muted small">{email || 'email@example.com'}</p>
                  
                  <div className={`role-badge ${isAdmin ? 'admin' : 'user'} mt-2`}>
                    {isAdmin ? 'مدیر کل (Admin)' : 'مشتری (Customer)'}
                  </div>
                </Col>

                {/* ستون فرم (سمت چپ) */}
                <Col md={8}>
                  <div className="p-md-3">
                    <Form.Group className='mb-4' controlId='name'>
                      <Form.Label className="modern-label"><FiUser className="me-2"/> نام و نام خانوادگی</Form.Label>
                      <Form.Control
                        type='name'
                        placeholder='نام کاربر را وارد کنید'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="modern-input"
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group className='mb-4' controlId='email'>
                      <Form.Label className="modern-label"><FiMail className="me-2"/> آدرس ایمیل</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='example@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="modern-input"
                      ></Form.Control>
                    </Form.Group>

                    {/* کارت انتخاب نقش (جایگزین چک‌باکس) */}
                    <Form.Group className='mb-4' controlId='isadmin'>
                      <Form.Label className="modern-label mb-3"><FiShield className="me-2"/> سطح دسترسی</Form.Label>
                      
                      <div 
                        className={`admin-role-card ${isAdmin ? 'active' : ''}`}
                        onClick={() => setIsAdmin(!isAdmin)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                             <div className="icon-box">
                               <FiShield size={24} />
                             </div>
                             <div>
                               <h6 className="mb-0 fw-bold">دسترسی مدیریت</h6>
                               <small className="text-muted">دسترسی کامل به پنل ادمین، محصولات و سفارشات</small>
                             </div>
                          </div>
                          <div className="check-circle">
                             {isAdmin && <FiCheckCircle size={20} />}
                          </div>
                        </div>
                      </div>
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-5">
                      <Button type='submit' className='btn-submit-fashion'>
                        <FiSave className="ms-2" size={20} />
                        ذخیره تغییرات
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Container>
    </div>
  );
};

export default UserEditScreen;