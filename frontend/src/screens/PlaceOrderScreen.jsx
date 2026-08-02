import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import '../assets/styles/PlaceOrderScreen.css'; // اتصال به فایل استایل اختصاصی

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="luxury-placeorder-wrapper">
      <div className="placeorder-container">
        
        {/* نوار مراحل خرید */}
        <CheckoutSteps step1 step2 step3 step4 />

        <div className="placeorder-header">
          <h1 className="placeorder-main-title">تایید نهایی سفارش</h1>
          <p className="placeorder-subtitle">لطفاً اطلاعات سفارش خود را پیش از پرداخت بررسی کنید</p>
        </div>

        <div className="placeorder-grid-layout">
          
          {/* --- ستون اصلی (راست) --- */}
          <div className="placeorder-main-column">
            
            {/* کارت اطلاعات ارسال و پرداخت */}
            <div className="luxury-order-card">
              <h2 className="card-section-title">
                <FiMapPin className="section-icon" /> اطلاعات ارسال و پرداخت
              </h2>
              
              <div className="info-details-grid">
                <div className="info-block">
                  <span className="info-label">آدرس تحویل گیرنده</span>
                  <span className="info-value">
                    {cart.shippingAddress.address}، {cart.shippingAddress.city}
                  </span>
                  <span className="info-sub-value">کد پستی: {cart.shippingAddress.postalCode}</span>
                </div>

                <div className="info-block">
                  <span className="info-label">
                    <FiCreditCard className="inline-icon" /> روش پرداخت انتخاب شده
                  </span>
                  <span className="info-value text-teal">
                    {cart.paymentMethod === 'ZarinPal' ? 'درگاه پرداخت امن زرین‌پال' : cart.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* کارت اقلام سفارش */}
            <div className="luxury-order-card">
              <h2 className="card-section-title">
                <FiPackage className="section-icon" /> اقلام سفارش ({cart.cartItems.length} کالا)
              </h2>
              
              {cart.cartItems.length === 0 ? (
                <Message>سبد خرید شما خالی است</Message>
              ) : (
                <div className="order-items-list">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="order-product-item">
                      <div className="product-image-box">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="product-item-details">
                        <Link to={`/product/${item.product}`} className="product-item-name">
                          {item.name}
                        </Link>
                        
                        <div className="product-item-meta">
                          <span className="item-qty">{item.qty} عدد</span>
                          <span className="item-price">
                            {Number(item.price).toLocaleString()} <small>تومان</small>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- ستون کناری (فاکتور) --- */}
          <div className="placeorder-sidebar">
            <div className="invoice-card">
              <h3 className="invoice-title">خلاصه سفارش</h3>
              
              <div className="invoice-row">
                <span className="invoice-label">قیمت کالاها</span>
                <span className="invoice-value">{Number(cart.itemsPrice).toLocaleString()} تومان</span>
              </div>
              
              <div className="invoice-row">
                <span className="invoice-label">هزینه ارسال</span>
                <span className="invoice-value text-teal">
                  {Number(cart.shippingPrice) === 0 ? 'رایگان' : `${Number(cart.shippingPrice).toLocaleString()} تومان`}
                </span>
              </div>
              
              <div className="invoice-row">
                <span className="invoice-label">مالیات</span>
                <span className="invoice-value">{Number(cart.taxPrice).toLocaleString()} تومان</span>
              </div>

              <hr className="invoice-divider" />

              <div className="invoice-total">
                <span>مبلغ قابل پرداخت</span>
                <div className="total-amount">
                  {Number(cart.totalPrice).toLocaleString()} <small>تومان</small>
                </div>
              </div>

              {error && (
                <div className="mb-3">
                   <Message variant="danger">{error?.data?.message || error.error}</Message>
                </div>
              )}

              <button
                type="button"
                className="btn-luxury-submit"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  <Loader size="sm" />
                ) : (
                  'ثبت نهایی و پرداخت'
                )}
              </button>
              
              <p className="payment-note mt-3 text-center">
                با ثبت سفارش، قوانین و مقررات سایت را می‌پذیرید.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;