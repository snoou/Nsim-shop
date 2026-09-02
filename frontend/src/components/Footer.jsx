import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaTelegramPlane } from 'react-icons/fa';
import '../assets/styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      
      <div className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-text">
            <h3>از جدیدترین تخفیف‌ها باخبر شوید!</h3>
            <p>ایمیل خود را وارد کنید تا از حراج‌های پوشاک و تخفیف‌های سوپرمارکت جا نمانید.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="آدرس ایمیل شما..." required />
            <button type="submit">ثبت نام</button>
          </form>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container">
          
          <div className="footer-col brand-col">
            <h2 className="footer-brand">نسیم</h2>
            <p className="footer-desc">
              فروشگاه همه‌کاره نسیم؛ ترکیبی از زیبایی استایل و تازگی مصرف روزانه. ما بهترین‌های پوشاک و خواروبار را با تضمین کیفیت به دست شما می‌رسانیم.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="social-icon" aria-label="Telegram"><FaTelegramPlane /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">راهنمای مشتریان</h4>
            <ul className="footer-links">
              <li><Link to="/profile">پیگیری سفارشات</Link></li>
              <li><Link to="/shipping-policy">رویه ارسال سریع</Link></li>
              <li><Link to="/returns">شرایط مرجوعی کالا</Link></li>
              <li><Link to="/size-guide">راهنمای انتخاب سایز</Link></li>
              <li><Link to="/faq">پرسش‌های متداول</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">ارتباط با ما</h4>
            <ul className="contact-info">
              <li>
                <FiMapPin className="contact-icon" />
                <span>تهران</span>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <span dir="ltr">۰۲۱ - ۸۸۸۸۴۴۴۴</span>
              </li>
              <li>
                <FiMail className="contact-icon" />
                <span>support@nasim.ir</span>
              </li>
              <li className="work-hours">
                 پاسخگویی: شنبه تا چهارشنبه ۹ الی ۱۷
              </li>
            </ul>
          </div>

          <div className="footer-col trust-col">
            <h4 className="footer-title">خرید امن</h4>
            <div className="trust-badges">
              <div className="trust-box">
                <img src="https://via.placeholder.com/80x80?text=E-Namad" alt="اینماد" />
              </div>
              <div className="trust-box">
                <img src="https://via.placeholder.com/80x80?text=Samandehi" alt="ساماندهی" />
              </div>
            </div>
            <p className="trust-desc">
              پرداخت امن با کلیه کارت‌های عضو شتاب
            </p>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">
            تمامی حقوق برای فروشگاه <span>نسیم</span> محفوظ است &copy; {currentYear}
          </p>
          <p className="developer">
            طراحی و توسعه با ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;