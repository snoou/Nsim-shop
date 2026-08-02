import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 🟢 ۱. ایمپورت برای خواندن استیت لاگین
import { FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import SearchBox from './SearchBox';
import '../assets/styles/Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [storeMode, setStoreMode] = useState('fashion'); // حالت‌های ممکن: 'fashion' یا 'supermarket'
  
  // 🟢 ۲. گرفتن اطلاعات کاربر واقعی از Redux Store
  const { userInfo } = useSelector((state) => state.auth);
  
  // 🟢 ۳. گرفتن تعداد محصولات واقعی از استیت سبد خرید (Cart)
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  return (
    <header className="main-header">
      
      {/* بخش سوئیچر تغییر حالت فروشگاه */}
      <div className="store-mode-selector">
        <div className="mode-toggle-container">
          <button 
            className={`mode-btn ${storeMode === 'fashion' ? 'active' : ''}`}
            onClick={() => setStoreMode('fashion')}
          >
            👗 مد و پوشاک
          </button>
          <button 
            className={`mode-btn ${storeMode === 'supermarket' ? 'active' : ''}`}
            onClick={() => setStoreMode('supermarket')}
          >
            🍎 سوپرمارکت
          </button>
        </div>
      </div>

      <div className="header-container">
        
        {/* ۱. لوگو و دکمه موبایل */}
        <div className="header-brand">
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          
          <Link to="/" className="logo-link">
            <span className="logo-text">نسیم</span>
          </Link>
        </div>

        {/* ۲. نوار جستجوی عریض هوشمند */}
        <SearchBox/>

        {/* ۳. دکمه‌های کاربری و سبد خرید (کاملاً هوشمند بر اساس لاگین بودن) */}
        <div className="header-actions">
          {userInfo ? (
            // 🟢 اگر کاربر وارد شده باشد، با کلیک مستقیماً به /profile می‌رود
            <Link to="/profile" className="action-btn">
              <FiUser /> <span>{userInfo.name || 'حساب کاربری'}</span>
            </Link>
          ) : (
            // 🔴 اگر کاربر وارد نشده باشد، به صفحه ورود می‌رود
            <Link to="/login" className="action-btn outline">
              <FiUser /> <span>ورود | ثبت‌نام</span>
            </Link>
          )}

          <Link to="/cart" className="cart-btn">
            <FiShoppingBag />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* نوار دسته‌بندی‌ها (داینامیک بر اساس حالت) */}
      <nav className="header-nav">
        <div className="nav-container">
          {storeMode === 'fashion' ? (
            <>
              <Link to="/fashion/new" className="nav-item">✨ جدیدترین‌ها</Link>
              <Link to="/fashion/women" className="nav-item">زنانه</Link>
              <Link to="/fashion/men" className="nav-item">مردانه</Link>
              <Link to="/fashion/accessories" className="nav-item">اکسسوری</Link>
              <Link to="/fashion/sale" className="nav-item text-accent">٪ حراج فصل</Link>
            </>
          ) : (
            <>
              <Link to="/supermarket/fresh" className="nav-item">🥬 میوه و سبزیجات</Link>
              <Link to="/supermarket/dairy" className="nav-item">🥛 لبنیات</Link>
              <Link to="/supermarket/drinks" className="nav-item">🧃 نوشیدنی‌ها</Link>
              <Link to="/supermarket/snacks" className="nav-item">🍫 تنقلات</Link>
              <Link to="/supermarket/sale" className="nav-item text-accent">٪ تخفیف روزانه</Link>
            </>
          )}
        </div>
      </nav>

      {/* منوی موبایل (داینامیک) */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
         {storeMode === 'fashion' ? (
            <>
              <Link to="/fashion/new" className="mobile-item">جدیدترین‌ها</Link>
              <Link to="/fashion/women" className="mobile-item">زنانه</Link>
              <Link to="/fashion/sale" className="mobile-item text-accent">حراج فصل</Link>
            </>
         ) : (
            <>
              <Link to="/supermarket/fresh" className="mobile-item">میوه و سبزیجات</Link>
              <Link to="/supermarket/dairy" className="mobile-item">لبنیات</Link>
              <Link to="/supermarket/sale" className="mobile-item text-accent">تخفیف روزانه</Link>
            </>
         )}
      </div>
    </header>
  );
};

export default Header;