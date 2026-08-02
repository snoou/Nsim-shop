import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import '../assets/styles/LoginScreen.css'

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
    <div className="luxury-auth-page-wrapper">
      <div className="luxury-auth-card">
        
        <div className="auth-header">
          <h1 className="auth-title">ورود به حساب</h1>
          <p className="auth-subtitle">خوشحالیم که دوباره شما را می‌بینیم</p>
        </div>

        <form onSubmit={submitHandler} className="luxury-auth-form">
          
          {/* فیلد ایمیل */}
          <div className="luxury-input-group">
            <FiMail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="پست الکترونیک"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="luxury-input"
              required
            />
          </div>

          {/* فیلد رمز عبور */}
          <div className="luxury-input-group">
            <FiLock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="luxury-input"
              required
            />
          </div>

          <div className="forgot-password-container">
            <Link to="/forgot-password" className="forgot-link">
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </div>

          {/* دکمه ورود */}
          <button type="submit" className="btn-luxury-auth" disabled={isLoading}>
            {isLoading ? (
              <Spinner size="sm" animation="border" variant="light" />
            ) : (
              <>
                <span>ورود به پنل کاربری</span>
                <FiLogIn size={20} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer text-center mt-4">
          <span className="footer-text">هنوز عضو نشده‌اید؟ </span>
          <Link 
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="link-highlight"
          >
            ایجاد حساب جدید <FiArrowLeft size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;