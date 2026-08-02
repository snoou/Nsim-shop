import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

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
      toast.success(`${res.name} عزیز، خوش آمدید`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <style>{`
        .auth-page-wrapper {
          min-height: 80vh;
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
          padding: 3.5rem 3rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f0;
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
          padding: 14px 45px 14px 15px;
          border: 1px solid #eee;
          border-radius: 12px;
          background: #fcfcfc;
          transition: all 0.3s ease;
          font-size: 1rem;
        }
        .custom-input:focus {
          background: #fff;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
          outline: none;
        }
        .forgot-link {
          display: block;
          text-align: left;
          font-size: 0.85rem;
          color: #999;
          text-decoration: none;
          margin-top: -0.5rem;
          margin-bottom: 1.5rem;
          transition: color 0.2s;
        }
        .forgot-link:hover {
          color: #000;
        }
        .btn-auth {
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-weight: 700;
          font-size: 1.1rem;
          width: 100%;
          transition: all 0.3s;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
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
          margin-top: 2.5rem;
          font-size: 0.95rem;
          color: #666;
        }
        .link-highlight {
          color: #1a1a1a;
          font-weight: 800;
          text-decoration: none;
          margin-right: 5px;
          padding-bottom: 2px;
          border-bottom: 2px solid #eee;
          transition: all 0.2s;
        }
        .link-highlight:hover {
          border-color: #1a1a1a;
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">ورود به حساب</h1>
          <p className="auth-subtitle">خوشحالیم که دوباره شما را می‌بینیم</p>
        </div>

        <Form onSubmit={submitHandler}>
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
              placeholder='رمز عبور'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-input"
              required
            />
          </div>

          <Link to="/forgot-password" size="sm" className="forgot-link">
            رمز عبور را فراموش کرده‌اید؟
          </Link>

          <button type='submit' className='btn-auth' disabled={isLoading}>
            {isLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <FiLogIn size={20} />
                <span>ورود به پنل کاربری</span>
              </>
            )}
          </button>
        </Form>

        <div className="auth-footer">
          <span>هنوز عضو نشده‌اید؟</span>
          <Link 
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="link-highlight"
          >
            ایجاد حساب جدید <FiArrowLeft size={14} className="ms-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;