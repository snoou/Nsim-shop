import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FiMapPin, FiNavigation, FiGlobe, FiHash, FiArrowLeft } from 'react-icons/fi';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'ایران');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="shipping-page-wrapper">
      <style>{`
        .shipping-page-wrapper {
          min-height: 85vh;
          background-color: #F9F9F7;
          font-family: 'Vazirmatn', sans-serif;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .shipping-card {
          background: #fff;
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 650px; /* کمی عریض‌تر از فرم لاگین */
          box-shadow: 0 15px 35px rgba(0,0,0,0.03);
          border: 1px solid #f0f0f0;
          margin-top: 2rem;
        }
        .page-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .page-subtitle {
          color: #888;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        .input-group-custom {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .field-icon {
          position: absolute;
          top: 50%; /* وسط‌چین عمودی نسبت به کل ارتفاع اینپوت */
          right: 15px;
          transform: translateY(-20%); /* اصلاح دقیق مرکزیت */
          color: #aaa;
          z-index: 10;
          font-size: 1.2rem;
        }
        /* تنظیم لیبل برای قرارگیری دقیق */
        .form-label-custom {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
          display: block;
          font-weight: 500;
        }
        .modern-input {
          width: 100%;
          padding: 12px 45px 12px 15px;
          border: 1px solid #eee;
          border-radius: 12px;
          background: #fcfcfc;
          transition: all 0.3s ease;
          font-size: 1rem;
          height: 50px; /* ارتفاع ثابت برای هماهنگی */
        }
        .modern-input:focus {
          background: #fff;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
          outline: none;
        }
        .ltr-input {
          direction: ltr;
          text-align: left;
          padding: 12px 15px 12px 45px; /* جابجایی پدینگ برای حالت چپ‌چین */
        }
        .ltr-input + .field-icon {
           right: auto;
           left: 15px; /* آیکون برود سمت چپ */
        }
        .btn-submit {
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-weight: 700;
          font-size: 1.1rem;
          width: 100%;
          margin-top: 1rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn-submit:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* نوار مراحل خرید */}
      <div style={{ width: '100%', maxWidth: '650px' }}>
        <CheckoutSteps step1 step2 />
      </div>

      <div className="shipping-card">
        <h1 className="page-title">کجا ارسال کنیم؟</h1>
        <p className="page-subtitle">آدرس دقیق تحویل سفارش را وارد کنید</p>

        <Form onSubmit={submitHandler}>
          
          {/* آدرس کامل */}
          <div className="input-group-custom">
            <Form.Label className="form-label-custom">آدرس کامل پستی</Form.Label>
            <div style={{position: 'relative'}}>
              <FiMapPin className="field-icon" style={{transform: 'translateY(-50%)'}} />
              <Form.Control
                type='text'
                placeholder='استان، شهر، خیابان، پلاک...'
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className="modern-input"
              />
            </div>
          </div>

          <Row>
            {/* شهر */}
            <Col md={6}>
              <div className="input-group-custom">
                <Form.Label className="form-label-custom">شهر</Form.Label>
                <div style={{position: 'relative'}}>
                  <FiNavigation className="field-icon" style={{transform: 'translateY(-50%)'}} />
                  <Form.Control
                    type='text'
                    placeholder='مثلاً تهران'
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                    className="modern-input"
                  />
                </div>
              </div>
            </Col>

            {/* کد پستی */}
            <Col md={6}>
              <div className="input-group-custom">
                <Form.Label className="form-label-custom">کد پستی</Form.Label>
                <div style={{position: 'relative'}}>
                   {/* نکته: برای فیلد عددی چپ‌چین، آیکون را سمت چپ می‌بریم */}
                  <FiHash className="field-icon" style={{right: 'auto', left: '15px', transform: 'translateY(-50%)'}} />
                  <Form.Control
                    type='text'
                    placeholder='۱۰ رقمی'
                    value={postalCode}
                    required
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="modern-input ltr-input"
                  />
                </div>
              </div>
            </Col>
          </Row>

          {/* کشور */}
          <div className="input-group-custom">
            <Form.Label className="form-label-custom">کشور</Form.Label>
            <div style={{position: 'relative'}}>
              <FiGlobe className="field-icon" style={{transform: 'translateY(-50%)'}} />
              <Form.Control
                type='text'
                placeholder='ایران'
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
                className="modern-input"
              />
            </div>
          </div>

          <Button type='submit' className='btn-submit'>
            <span>ادامه به مرحله پرداخت</span>
            <FiArrowLeft size={20} />
          </Button>

        </Form>
      </div>
    </div>
  );
};

export default ShippingScreen;