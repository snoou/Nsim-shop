import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import '../assets/styles/ShippingScreen.css';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ fullName, phone, address, city, postalCode }));
    navigate('/payment');
  };

  return (
    <div className="editorial-shipping-wrapper">
      <div className="editorial-shipping-container">
        
        <CheckoutSteps step1 step2 />

        <div className="clean-shipping-box">
          <div className="shipping-text-center">
            <h1 className="shipping-heading">اطلاعات ارسال</h1>
            <p className="shipping-subheading">مشخصات و آدرس دقیق تحویل گیرنده</p>
          </div>

          <form onSubmit={submitHandler} className="clean-shipping-form">
            
            <div className="form-group-minimal">
              <label>نام و نام خانوادگی تحویل‌گیرنده</label>
              <input
                type="text"
                placeholder="مثلاً سارا احمدی"
                value={fullName}
                required
                onChange={(e) => setFullName(e.target.value)}
                className="input-minimal"
              />
            </div>

            {/* شماره تلفن همراه */}
            <div className="form-group-minimal">
              <label>شماره تلفن همراه</label>
              <input
                type="tel"
                placeholder="09123456789"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
                className="input-minimal ltr-align"
              />
            </div>

            <div className="form-group-minimal">
              <label>آدرس کامل پستی</label>
              <textarea
                rows="2"
                placeholder="استان، شهر، خیابان، پلاک، واحد..."
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className="input-minimal"
              ></textarea>
            </div>

            <div className="form-row-minimal">
              <div className="form-group-minimal w-50">
                <label>شهر</label>
                <input
                  type="text"
                  placeholder="مثلاً تهران"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                  className="input-minimal"
                />
              </div>

              <div className="form-group-minimal w-50">
                <label>کد پستی</label>
                <input
                  type="text"
                  placeholder="۱۰ رقمی"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="input-minimal ltr-align"
                />
              </div>
            </div>

            <button type="submit" className="btn-black-solid">
              ادامه پرداخت <FiArrowLeft size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ShippingScreen