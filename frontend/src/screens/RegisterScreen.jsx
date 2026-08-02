import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

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
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success(`خوش آمدید، ${name} عزیز!`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <style>{`
        .auth-page-wrapper {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F9F9F7;
          font-family: 'Vazirmatn', sans-serif;
          padding: 20px;
        }
        .auth-card {
          background: #fff;
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f0;
          position: relative;
          overflow: hidden;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .auth-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }
        .auth-subtitle {
          color: #888;
          font-size: 0.95rem;
        }
        .input-wrapper {
          position: relative;
          margin-bottom: 1.2rem;
        }
        .input-icon {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          color: #aaa;
          z-index: 10;
        }
        .custom-input {
          width: 100%;
          padding: 12px 45px 12px 15px; /* فضای سمت راست برای آیکون */
          border: 1px solid #eee;
          border-radius: 12px;
          background: #fcfcfc;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }
        .custom-input:focus {
          background: #fff;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
          outline: none;
        }
        .btn-auth {
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-weight: 700;
          font-size: 1rem;
          width: 100%;
          margin-top: 1rem;
          transition: all 0.3s;
          cursor: pointer;
        }
        .btn-auth:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .btn-auth:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }
        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #666;
        }
        .link-highlight {
          color: #1a1a1a;
          font-weight: 700;
          text-decoration: none;
          margin-right: 5px;
          border-bottom: 1px dashed #ccc;
          transition: all 0.2s;
        }
        .link-highlight:hover {
          border-bottom-style: solid;
          border-color: #000;
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">عضویت در خانواده ما</h1>
          <p className="auth-subtitle">برای تجربه خریدی متفاوت آماده‌اید؟</p>
        </div>

        <Form onSubmit={submitHandler}>
          {/* نام کامل */}
          <div className="input-wrapper">
            <FiUser className="input-icon" size={20} />
            <input
              type='text'
              placeholder='نام و نام خانوادگی'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="custom-input"
              required
            />
          </div>

          {/* ایمیل */}
          <div className="input-wrapper">
            <FiMail className="input-icon" size={20} />
            <input
              type='email'
              placeholder='پست الکترونیک'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="custom-input"
              required
            />
          </div>

          {/* رمز عبور */}
          <div className="input-wrapper">
            <FiLock className="input-icon" size={20} />
            <input
              type='password'
              placeholder='رمز عبور (حداقل ۶ کاراکتر)'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-input"
              required
            />
          </div>

          {/* تکرار رمز عبور */}
          <div className="input-wrapper">
            <FiCheckCircle className="input-icon" size={20} />
            <input
              type='password'
              placeholder='تکرار رمز عبور'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="custom-input"
              required
            />
          </div>

          <button type='submit' className='btn-auth' disabled={isLoading}>
            {isLoading ? (
              <div className="d-flex align-items-center justify-content-center gap-2">
                <Spinner size="sm" animation="border" /> در حال ثبت...
              </div>
            ) : (
              'تکمیل ثبت نام'
            )}
          </button>
        </Form>

        <div className="auth-footer">
          <span>قبلاً عضو شده‌اید؟</span>
          <Link 
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="link-highlight"
          >
            وارد شوید <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;