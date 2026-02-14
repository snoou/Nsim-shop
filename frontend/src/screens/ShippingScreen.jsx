import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FiMapPin, FiNavigation, FiGlobe, FiHash, FiArrowLeft } from 'react-icons/fi'; // آیکون‌های مدرن
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="shipping-page-wrapper">
      <Container>
        {/* نوار مراحل خرید (Stepper) */}
        <div className="checkout-steps-container">
          <CheckoutSteps step1 step2 />
        </div>

        <FormContainer>
          <div className="shipping-card">
            <div className="text-center mb-5">
              <h1 className="shipping-title">کجا ارسال کنیم؟</h1>
              <p className="text-muted">آدرس تحویل سفارش خود را وارد کنید</p>
            </div>

            <Form onSubmit={submitHandler}>
              {/* آدرس کامل */}
              <Form.Group controlId='address' className='mb-4 position-relative'>
                <Form.Label className="floating-label">آدرس کامل پستی</Form.Label>
                <div className="input-with-icon">
                  <FiMapPin className="field-icon" />
                  <Form.Control
                    type='text'
                    placeholder='تهران، خیابان...'
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                    className="modern-input"
                  ></Form.Control>
                </div>
              </Form.Group>

              <Row>
                {/* شهر */}
                <Col md={6}>
                  <Form.Group controlId='city' className='mb-4 position-relative'>
                    <Form.Label className="floating-label">شهر</Form.Label>
                    <div className="input-with-icon">
                      <FiNavigation className="field-icon" />
                      <Form.Control
                        type='text'
                        placeholder='مثلاً تهران'
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                        className="modern-input"
                      ></Form.Control>
                    </div>
                  </Form.Group>
                </Col>

                {/* کد پستی */}
                <Col md={6}>
                  <Form.Group controlId='postalCode' className='mb-4 position-relative'>
                    <Form.Label className="floating-label">کد پستی</Form.Label>
                    <div className="input-with-icon">
                      <FiHash className="field-icon" />
                      <Form.Control
                        type='text'
                        placeholder='۱۰ رقمی'
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="modern-input ltr-input" // ltr برای اعداد
                      ></Form.Control>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* کشور */}
              <Form.Group controlId='country' className='mb-5 position-relative'>
                <Form.Label className="floating-label">کشور</Form.Label>
                <div className="input-with-icon">
                  <FiGlobe className="field-icon" />
                  <Form.Control
                    type='text'
                    placeholder='ایران'
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                    className="modern-input"
                  ></Form.Control>
                </div>
              </Form.Group>

              {/* دکمه ادامه */}
              <Button type='submit' className='btn-submit-shipping'>
                <span>ادامه به مرحله پرداخت</span>
                <FiArrowLeft className="ms-2" />
              </Button>
            </Form>
          </div>
        </FormContainer>
      </Container>
    </div>
  );
};

export default ShippingScreen;