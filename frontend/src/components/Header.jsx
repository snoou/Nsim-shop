import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';
import SearchBox from './SearchBox';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import '../assets/styles/Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [storeMode, setStoreMode] = useState('fashion'); // 'fashion' | 'supermarket'
  
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="luxury-header">
      
      {/* 1. نوار بالایی (Top Bar) برای تغییر حالت و پیام‌ها */}
      <div className="top-announcement-bar">
        <div className="top-bar-container">
          <span className="announcement-text">ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان</span>
          <div className="store-mode-selector">
            <button 
              className={`mode-btn ${storeMode === 'fashion' ? 'active' : ''}`}
              onClick={() => setStoreMode('fashion')}
            >
              کالکشن فشن
            </button>
            <span className="mode-divider">|</span>
            <button 
              className={`mode-btn ${storeMode === 'supermarket' ? 'active' : ''}`}
              onClick={() => setStoreMode('supermarket')}
            >
              سوپرمارکت
            </button>
          </div>
        </div>
      </div>

      {/* 2. بخش اصلی هدر */}
      <div className="main-header-container">
        
        {/* راست: لوگو و دکمه موبایل */}
        <div className="header-brand-area">
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <Link to="/" className="luxury-logo">
            NASIM.
          </Link>
        </div>

        {/* مرکز: سرچ باکس هوشمند */}
        <div className="header-search-area">
          <SearchBox />
        </div>

        {/* چپ: آیکون‌های کاربری و سبد خرید */}
        <div className="header-actions-area">
          
          {/* منوی ادمین (فقط در صورت ادمین بودن نمایش داده می‌شود) */}
          {userInfo && userInfo.isAdmin && (
            <div className="luxury-dropdown">
              <button className="action-icon-btn admin-badge">
                مدیریت <FiChevronDown size={14} />
              </button>
              <div className="dropdown-content">
                <Link to="/admin/productlist"><FiGrid /> محصولات</Link>
                <Link to="/admin/orderlist"><FiShoppingBag /> سفارش‌ها</Link>
                <Link to="/admin/userlist"><FiUser /> کاربران</Link>
              </div>
            </div>
          )}

          {/* منوی کاربری */}
          {userInfo ? (
            <div className="luxury-dropdown">
              <button className="action-icon-btn">
                <FiUser size={20} />
                <span className="d-none-mobile">{userInfo.name.split(' ')[0]}</span>
                <FiChevronDown size={14} className="d-none-mobile" />
              </button>
              <div className="dropdown-content">
                <Link to="/profile"><FiSettings /> حساب کاربری</Link>
                <button onClick={logoutHandler} className="text-danger">
                  <FiLogOut /> خروج
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="action-icon-btn">
              <FiUser size={20} />
              <span className="d-none-mobile">ورود</span>
            </Link>
          )}

          {/* سبد خرید */}
          <Link to="/cart" className="action-icon-btn cart-btn">
            <FiShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* 3. نوار دسته‌بندی‌ها */}
      <nav className="category-nav">
        <div className="nav-container">
          {storeMode === 'fashion' ? (
            <>
              <Link to="/fashion/new" className="nav-item">جدیدترین‌ها</Link>
              <Link to="/fashion/women" className="nav-item">زنانه</Link>
              <Link to="/fashion/men" className="nav-item">مردانه</Link>
              <Link to="/fashion/accessories" className="nav-item">اکسسوری</Link>
              <Link to="/fashion/sale" className="nav-item highlight-red">حراج فصل %</Link>
            </>
          ) : (
            <>
              <Link to="/supermarket/fresh" className="nav-item">میوه و سبزیجات</Link>
              <Link to="/supermarket/dairy" className="nav-item">لبنیات</Link>
              <Link to="/supermarket/drinks" className="nav-item">نوشیدنی‌ها</Link>
              <Link to="/supermarket/snacks" className="nav-item">تنقلات</Link>
              <Link to="/supermarket/sale" className="nav-item highlight-red">تخفیف روزانه %</Link>
            </>
          )}
        </div>
      </nav>

      {/* 4. منوی کشویی موبایل */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* محتوای منوی موبایل... (مشابه نوار دسته‌بندی) */}
           {storeMode === 'fashion' ? (
              <>
                <Link to="/fashion/new" className="mobile-nav-item" onClick={()=>setIsMobileMenuOpen(false)}>جدیدترین‌ها</Link>
                <Link to="/fashion/women" className="mobile-nav-item" onClick={()=>setIsMobileMenuOpen(false)}>زنانه</Link>
                <Link to="/fashion/sale" className="mobile-nav-item highlight-red" onClick={()=>setIsMobileMenuOpen(false)}>حراج فصل</Link>
              </>
           ) : (
              <>
                <Link to="/supermarket/fresh" className="mobile-nav-item" onClick={()=>setIsMobileMenuOpen(false)}>میوه و سبزیجات</Link>
                <Link to="/supermarket/sale" className="mobile-nav-item highlight-red" onClick={()=>setIsMobileMenuOpen(false)}>تخفیف روزانه</Link>
              </>
           )}
        </div>
      </div>
      
      {/* بک‌گراند تاریک برای وقتی که منوی موبایل باز است */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </header>
  );
};

export default Header;