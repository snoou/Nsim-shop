import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
  FiGrid,
  FiPackage,
  FiUsers,
} from 'react-icons/fi';
import SearchBox from './SearchBox';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import '../assets/styles/Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();

  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        const triggerHeight = window.innerHeight * 1.5;
        setIsScrolled(window.scrollY > triggerHeight);
      } else {
        setIsScrolled(window.scrollY > 40);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const headerModeClass = (!isHomePage || isScrolled) ? 'is-scrolled' : 'is-glass';

  return (
    <>
      <header className={`luxury-header ${headerModeClass}`}>
        <div className="main-header-container">

          <div className="header-brand-area">
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
              <FiMenu size={26} />
            </button>
            <Link to="/" className="luxury-logo">
              نسیم.
            </Link>
          </div>

          <nav className="header-center-nav d-none-mobile">
            <Link to="/fashion/new" className="nav-item">جدیدترین‌ها</Link>
            <Link to="/fashion/women" className="nav-item">زنانه</Link>
            <Link to="/fashion/men" className="nav-item">مردانه</Link>
            <Link to="/fashion/sale" className="nav-item highlight-red">حراج فصل</Link>
          </nav>

          <div className="header-actions-area">
            <div className="d-none-mobile header-search-wrapper">
              <SearchBox />
            </div>

            {userInfo ? (
              <div className="luxury-dropdown">
                <button className="action-icon-btn">
                  <FiUser size={22} />
                </button>
                <div className="dropdown-content">
                  {userInfo.isAdmin && (
                    <>
                      <div className="dropdown-section-title">بخش مدیریت</div>
                      <Link to="/admin/productlist">
                        <FiGrid /> محصولات
                      </Link>
                      <Link to="/admin/orderlist">
                        <FiPackage /> سفارش‌ها
                      </Link>
                      <Link to="/admin/userlist">
                        <FiUsers /> کاربران
                      </Link>
                      <Link to="/admin/posterlist">
                        <FiGrid />  پوستر
                      </Link>

                      <Link to="admin/categorylist">
                        <FiGrid />  دسته بندی
                      </Link>

                      <div className="dropdown-divider"></div>
                    </>
                  )}

                  <Link to="/profile">
                    <FiSettings /> حساب کاربری
                  </Link>
                  <button onClick={logoutHandler} className="text-danger">
                    <FiLogOut /> خروج
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="action-icon-btn">
                <FiUser size={22} />
              </Link>
            )}

            <Link to="/cart" className="action-icon-btn cart-btn">
              <FiShoppingBag size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* منوی کشویی موبایل */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <span className="luxury-logo-small">NASIM.</span>
          <button className="close-mobile-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <div className="mobile-search-wrapper" style={{ marginBottom: '20px' }}>
            <SearchBox />
          </div>

          <Link to="/fashion/new" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>جدیدترین‌ها</Link>
          <Link to="/fashion/women" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>زنانه</Link>
          <Link to="/fashion/men" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>مردانه</Link>
          <Link to="/fashion/sale" className="mobile-nav-item highlight-red" onClick={() => setIsMobileMenuOpen(false)}>حراج فصل %</Link>

          {userInfo && userInfo.isAdmin && (
            <div className="mobile-admin-links">
              <div className="dropdown-section-title" style={{ marginTop: '16px', paddingRight: '0' }}>دسترسی مدیریت</div>
              <Link to="/admin/productlist" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}><FiGrid /> محصولات</Link>
              <Link to="/admin/orderlist" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}><FiPackage /> سفارش‌ها</Link>
              <Link to="/admin/userlist" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}><FiUsers /> کاربران</Link>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </>
  );
};

export default Header;