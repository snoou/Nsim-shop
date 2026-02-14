import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'; // آیکون‌های خطی و ظریف
import { FaTelegramPlane } from 'react-icons/fa'; // برای تلگرام

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fashion-footer">
      {/* بخش اصلی فوتر */}
      <div className="footer-main py-5">
        <Container>
          <Row className="gy-4">
            {/* ستون اول: درباره برند و سوشال */}
            <Col md={4} lg={3}>
              <h5 className="footer-brand mb-4">PROSHOP</h5>
              <p className="text-muted small lh-lg">
                نسیم مقصدی برای خانم‌های شیک‌پوش ایرانی. ما با ارائه جدیدترین کالکشن‌های مانتو، شال و اکسسوری، زیبایی و اصالت را به استایل شما هدیه می‌دهیم.
              </p>
              <div className="social-links d-flex gap-3 mt-4">
                <a href="#" className="social-icon"><FiInstagram size={20} /></a>
                <a href="#" className="social-icon"><FaTelegramPlane size={20} /></a>
                <a href="#" className="social-icon"><FiTwitter size={20} /></a>
              </div>
            </Col>

            {/* ستون دوم: خدمات مشتریان */}
            <Col md={4} lg={3}>
              <h6 className="footer-title mb-4">خدمات مشتریان</h6>
              <ul className="footer-links list-unstyled">
                <li><Link to="/profile">پیگیری سفارش</Link></li>
                <li><Link to="/shipping-policy">رویه ارسال سفارش</Link></li>
                <li><Link to="/returns">شرایط مرجوعی کالا</Link></li>
                <li><Link to="/size-guide">راهنمای انتخاب سایز</Link></li>
                <li><Link to="/faq">پرسش‌های متداول</Link></li>
              </ul>
            </Col>

            {/* ستون سوم: تماس با ما */}
            <Col md={4} lg={3}>
              <h6 className="footer-title mb-4">تماس با ما</h6>
              <ul className="contact-info list-unstyled small text-muted">
                <li className="mb-3 d-flex align-items-start">
                  <FiMapPin className="me-2 mt-1 text-accent" size={18} />
                  <span>تهران،پاکدشت خیابان بیست متری،</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FiPhone className="me-2 text-accent" size={18} />
                  <span>۰۲۱-۸۸۸۸۴۴۴۴</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FiMail className="me-2 text-accent" size={18} />
                  <span>support@proshop.ir</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                   <span>پاسخگویی: شنبه تا چهارشنبه ۹ تا ۱۷</span>
                </li>
              </ul>
            </Col>

            {/* ستون چهارم: نمادهای اعتماد (اینماد و ...) */}
            <Col md={12} lg={3} className="text-lg-end text-center mt-4 mt-lg-0">
              <h6 className="footer-title mb-4">نمادهای اعتماد</h6>
              <div className="trust-badges d-flex justify-content-lg-end justify-content-center gap-2">
                {/* جایگاه عکس اینماد */}
                <div className="trust-box">
                  <img src="https://via.placeholder.com/80x80?text=E-Namad" alt="اینماد" />
                </div>
                {/* جایگاه عکس ساماندهی */}
                <div className="trust-box">
                  <img src="https://via.placeholder.com/80x80?text=Samandehi" alt="ساماندهی" />
                </div>
              </div>
              <p className="small text-muted mt-3">
                پرداخت امن با کلیه کارت‌های عضو شتاب
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* بخش کپی‌رایت پایین */}
      <div className="footer-bottom py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0 small text-muted">
                تمامی حقوق برای فروشگاه <span className="text-light">نسیم</span> محفوظ است &copy; {currentYear}
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end mt-2 mt-md-0">
              <p className="mb-0 small text-muted" style={{fontSize: '10px'}}>
                Design by <span style={{color: '#c5a065'}}>YourName</span>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;