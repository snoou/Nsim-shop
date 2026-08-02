import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import '../assets/styles/CartScreen.css'; 

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // --- رندر حالت سبد خالی ---
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-icon">
          <FiShoppingBag size={56} />
        </div>
        <h2 className="empty-cart-title">سبد خرید شما خالی است</h2>
        <p className="empty-cart-text">محصولات جذابی در فروشگاه منتظر شما هستند.</p>
        <Link to="/" className="btn-back-to-shop">
          <FiArrowRight size={20} />
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  // --- رندر سبد خرید پر ---
  return (
    <div className="cart-page-wrapper">
      <div className="cart-header">
        <h1 className="cart-main-title">سبد خرید</h1>
        <span className="cart-items-count">{totalItems} کالا</span>
      </div>

      <div className="cart-grid-layout">
        
        {/* ستون راست: لیست محصولات */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item-card">
              
              {/* عکس محصول */}
              <div className="item-image-wrapper">
                <img src={item.image} alt={item.name} className="item-image" />
              </div>

              {/* اطلاعات محصول */}
              <div className="item-details">
                <div className="item-header">
                  <div className="item-name-brand">
                    <span className="item-brand">{item.brand || 'کالکشن نسیم'}</span>
                    <Link to={`/product/${item._id}`} className="item-name">
                      {item.name}
                    </Link>
                  </div>
                  <button 
                    className="item-remove-btn" 
                    onClick={() => removeFromCartHandler(item._id)}
                    aria-label="حذف محصول"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                <div className="item-footer">
                  {/* انتخابگر تعداد شیک و کپسولی */}
                  <div className="qty-pill-selector">
                    <button 
                      disabled={item.qty >= item.countInStock}
                      onClick={() => addToCartHandler(item, item.qty + 1)}
                    >
                      <FiPlus size={16} />
                    </button>
                    <span className="qty-number">{item.qty}</span>
                    <button 
                      disabled={item.qty <= 1}
                      onClick={() => addToCartHandler(item, item.qty - 1)}
                    >
                      <FiMinus size={16} />
                    </button>
                  </div>

                  {/* قیمت */}
                  <div className="item-price">
                    {(item.price * item.qty).toLocaleString()} 
                    <small>تومان</small>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ستون چپ: خلاصه سفارش */}
        <div className="cart-summary-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">خلاصه سفارش</h3>
            
            <div className="summary-row">
              <span className="summary-label">مبلغ کالاها ({totalItems})</span>
              <span className="summary-value">{totalPrice.toLocaleString()} تومان</span>
            </div>
            
            <div className="summary-row text-teal">
              <span className="summary-label">هزینه ارسال</span>
              <span className="summary-value bold">وابسته به آدرس</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total-row">
              <span className="total-label">مبلغ قابل پرداخت</span>
              <div className="total-value">
                {totalPrice.toLocaleString()} <small>تومان</small>
              </div>
            </div>

            <button className="btn-primary-checkout" onClick={checkoutHandler}>
              ثبت سفارش
            </button>
            
            <p className="summary-note">
              هزینه دقیق ارسال در مرحله بعد (آدرس) محاسبه می‌شود.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartScreen;