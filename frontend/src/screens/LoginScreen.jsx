import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'; // آیکون‌های جدید
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success(`${res.name} عزیز خوش آمدید`); // خوش‌آمدگویی گرم
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer title="ورود به حساب" subtitle="خوشحالیم که دوباره شما را می‌بینیم">
      <Form onSubmit={submitHandler} className="mt-4">
        
        {/* فیلد ایمیل با آیکون */}
        <InputGroup className="auth-input-group">
          <InputGroup.Text className="auth-icon">
            <FiMail size={20} />
          </InputGroup.Text>
          <Form.Control
            type='email'
            placeholder='پست الکترونیک خود را وارد کنید'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-form-control"
            dir="rtl"
          />
        </InputGroup>

        {/* فیلد پسورد با آیکون */}
        <InputGroup className="auth-input-group">
          <InputGroup.Text className="auth-icon">
            <FiLock size={20} />
          </InputGroup.Text>
          <Form.Control
            type='password'
            placeholder='رمز عبور'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-form-control"
            dir="rtl"
          />
        </InputGroup>

        <div className="d-flex justify-content-end mb-4">
          <Link to="/forgot-password" style={{fontSize: '0.8rem', color: '#888', textDecoration: 'none'}}>
            رمز عبور را فراموش کرده‌اید؟
          </Link>
        </div>

        <Button 
          disabled={isLoading} 
          type='submit' 
          className='w-100 rounded-pill py-2 btn-fashion mb-3'
        >
          {isLoading ? 'در حال پردازش...' : <><FiLogIn className="ms-2"/> ورود به حساب</>}
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3 text-center'>
        <Col>
          <span className="text-muted ms-2">هنوز عضو نشده‌اید؟</span>
          <Link 
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="fw-bold text-dark text-decoration-none border-bottom border-dark pb-1"
          >
            ثبت نام کنید
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;