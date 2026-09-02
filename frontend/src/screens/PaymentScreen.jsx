import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCreditCard, FiShield } from 'react-icons/fi';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import '../assets/styles/PaymentScreen.css'; 

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState('ZarinPal');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="luxury-payment-wrapper">
      
      <CheckoutSteps step1 step2 step3 />

      <div className="payment-card-container">
        <div className="payment-header">
          <h1 className="payment-title">روش پرداخت</h1>
          <p className="payment-subtitle">
            <FiShield className="shield-icon" /> درگاه بانکی امن مورد نظر خود را انتخاب کنید
          </p>
        </div>
        
        <form onSubmit={submitHandler} className="payment-form">
          <div className="payment-options-grid">
            
            <label 
              className={`luxury-payment-option ${paymentMethod === 'ZarinPal' ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="ZarinPal"
                checked={paymentMethod === 'ZarinPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden-radio"
              />
              
              <div className="option-content">
                <div className="option-icon-wrapper">
                  <FiCreditCard size={24} />
                </div>
                <div className="option-text">
                  <span className="option-title">پرداخت اینترنتی زرین‌پال</span>
                  <span className="option-desc">پذیرش تمامی کارت‌های عضو شتاب</span>
                </div>
              </div>
              
              <div className="custom-radio-indicator"></div>
            </label>


          </div>

          <button type="submit" className="btn-luxury-submit">
            ادامه و ثبت نهایی
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;