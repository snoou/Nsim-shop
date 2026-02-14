import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Button } from 'react-bootstrap';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi'; // آیکون‌های مدرن
import { addToCart, removeFromCart } from '../slices/cartSlice';

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

  // محاسبه قیمت کل
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // --- حالت سبد خالی ---
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container text-center">
        <div className="empty-icon-wrapper">
          <FiShoppingBag size={60} />
        </div>
        <h2 className="mt-4 fw-bold">سبد خرید شما خالی است!</h2>
        <p className="text-muted mb-5">به نظر می‌رسد هنوز محصولی را انتخاب نکرده‌اید.</p>
        <Link to="/" className="btn-fashion-outline">
          بازگشت به فروشگاه <FiArrowRight className="me-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <h1 className="page-title mb-5">سبد خرید ({totalItems})</h1>

      <Row>
        {/* لیست محصولات - سمت راست */}
        <Col lg={8}>
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                
                {/* عکس محصول */}
                <div className="cart-item-img">
                   <Image src={item.image} alt={item.name} />
                </div>

                {/* اطلاعات محصول */}
                <div className="cart-item-details">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <span className="text-muted small d-block mb-1">{item.brand || 'برند'}</span>
                      <Link to={`/product/${item._id}`} className="cart-item-title">
                        {item.name}
                      </Link>
                    </div>
                    {/* دکمه حذف */}
                    <button 
                      className="remove-btn" 
                      onClick={() => removeFromCartHandler(item._id)}
                      title="حذف از سبد"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>

                  <div className="cart-item-footer">
                     {/* کنترل تعداد */}
                     <div className="qty-selector-small">
                        <button 
                          disabled={item.qty <= 1}
                          onClick={() => addToCartHandler(item, item.qty - 1)}
                        >
                          <FiMinus />
                        </button>
                        <span>{item.qty}</span>
                        <button 
                          disabled={item.qty >= item.countInStock}
                          onClick={() => addToCartHandler(item, item.qty + 1)}
                        >
                          <FiPlus />
                        </button>
                     </div>

                     {/* قیمت کل آیتم */}
                     <div className="item-price">
                        {(item.price * item.qty).toLocaleString()} <span className="currency">تومان</span>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* خلاصه سفارش - سمت چپ (چسبان) */}
        <Col lg={4} className="mt-4 mt-lg-0">
          <div className="cart-summary-card">
            <h4 className="summary-title">خلاصه سفارش</h4>
            
            <div className="summary-row">
              <span>قیمت کالاها ({totalItems})</span>
              <span>{totalPrice.toLocaleString()} تومان</span>
            </div>
            
            <div className="summary-row text-success">
              <span>سود شما از خرید</span>
              <span>۰ تومان</span> {/* اگه سیستم تخفیف داشتی اینجا بذار */}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>مبلغ قابل پرداخت</span>
              <span>{totalPrice.toLocaleString()} <span className="small">تومان</span></span>
            </div>

            <Button
              type='button'
              className='btn-checkout w-100'
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              ادامه فرآیند خرید
            </Button>

            <div className="summary-info text-muted small mt-3 text-center">
              ارسال رایگان برای خریدهای بالای ۲ میلیون تومان
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;