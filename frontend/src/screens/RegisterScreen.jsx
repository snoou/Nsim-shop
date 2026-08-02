import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

// 🟢 توجه: ما از همان استایل‌های صفحه لاگین استفاده می‌کنیم تا طراحی کاملاً یکپارچه بماند
import '../assets/styles/LoginScreen.css'; 

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
    <div className="luxury-auth-page-wrapper">
      <div className="luxury-auth-card">
        
        <div className="auth-header">
          <h1 className="auth-title">عضویت در فروشگاه</h1>
          <p className="auth-subtitle">به دنیای مد و زیبایی نسیم بپیوندید</p>
        </div>

        <form onSubmit={submitHandler} className="luxury-auth-form">
          
          {/* نام کامل */}
          <div className="luxury-input-group">
            <FiUser className="input-icon" size={20} />
            <input
              type="text"
              placeholder="نام و نام خانوادگی"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="luxury-input"
              required
            />
          </div>

          {/* ایمیل */}
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

          {/* رمز عبور */}
          <div className="luxury-input-group">
            <FiLock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="رمز عبور (حداقل ۶ کاراکتر)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="luxury-input"
              required
            />
          </div>

          {/* تکرار رمز عبور */}
          <div className="luxury-input-group">
            <FiCheckCircle className="input-icon" size={20} />
            <input
              type="password"
              placeholder="تکرار رمز عبور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="luxury-input"
              required
            />
          </div>

          <button type="submit" className="btn-luxury-auth" disabled={isLoading}>
            {isLoading ? (
              <div className="d-flex align-items-center justify-content-center gap-2">
                <Spinner size="sm" animation="border" variant="light" />
                <span>در حال ثبت نام...</span>
              </div>
            ) : (
              'ایجاد حساب کاربری'
            )}
          </button>
        </form>

        <div className="auth-footer text-center mt-4">
          <span className="footer-text">حساب کاربری دارید؟ </span>
          <Link 
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="link-highlight"
          >
            وارد شوید <FiArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;