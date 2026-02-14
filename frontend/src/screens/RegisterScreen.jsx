import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi'; // آیکون‌ها
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error('رمز عبور و تکرار آن مطابقت ندارند');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success('به خانواده پروشاپ خوش آمدید!');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer 
      title="عضویت در خانواده ما" 
      subtitle="برای تجربه خریدی لوکس و متفاوت آماده‌اید؟"
    >
      <Form onSubmit={submitHandler} className="mt-4">
        
        {/* نام کامل */}
        <InputGroup className="auth-input-group">
          <InputGroup.Text className="auth-icon"><FiUser size={20} /></InputGroup.Text>
          <Form.Control
            type='text'
            placeholder='نام و نام خانوادگی'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-form-control"
          />
        </InputGroup>

        {/* ایمیل */}
        <InputGroup className="auth-input-group">
          <InputGroup.Text className="auth-icon"><FiMail size={20} /></InputGroup.Text>
          <Form.Control
            type='email'
            placeholder='پست الکترونیک'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-form-control"
          />
        </InputGroup>

        {/* رمز عبور */}
        <InputGroup className="auth-input-group">
          <InputGroup.Text className="auth-icon"><FiLock size={20} /></InputGroup.Text>
          <Form.Control
            type='password'
            placeholder='رمز عبور (حداقل ۶ کاراکتر)'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-form-control"
          />
        </InputGroup>

        {/* تکرار رمز عبور */}
        <InputGroup className="auth-input-group">
          <InputGroup.Text className="auth-icon"><FiCheckCircle size={20} /></InputGroup.Text>
          <Form.Control
            type='password'
            placeholder='تکرار رمز عبور'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-form-control"
          />
        </InputGroup>

        <Button 
          disabled={isLoading} 
          type='submit' 
          className='w-100 rounded-pill py-2 btn-fashion mb-3'
        >
          {isLoading ? 'در حال ثبت نام...' : 'تکمیل ثبت نام'}
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3 text-center'>
        <Col>
          <span className="text-muted ms-2">قبلاً عضو شده‌اید؟</span>
          <Link 
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="fw-bold text-dark text-decoration-none border-bottom border-dark pb-1"
          >
            وارد شوید
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;