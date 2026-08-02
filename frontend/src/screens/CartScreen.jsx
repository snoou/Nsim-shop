import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Button, Container } from 'react-bootstrap';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
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

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Container className="cart-page-wrapper py-5">
      <style>{`
        .cart-page-wrapper {
          font-family: 'Vazirmatn', sans-serif;
          direction: rtl;
          background-color: #F9F9F7;
          min-height: 80vh;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
        }
        .cart-items-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .cart-item {
          background: #fff;
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          border: 1px solid #f0f0f0;
          transition: transform 0.2s;
        }
        .cart-item-img img {
          width: 100px;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
          background: #f8f8f8;
        }
        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .cart-item-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          text-decoration: none;
        }
        .remove-btn {
          background: #fff0f0;
          color: #ff4d4d;
          border: none;
          padding: 8px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .remove-btn:hover {
          background: #ff4d4d;
          color: #fff;
        }
        .cart-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }
        .qty-selector-small {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 12px;
          padding: 4px;
        }
        .qty-selector-small button {
          border: none;
          background: #fff;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }
        .qty-selector-small span {
          padding: 0 15px;
          font-weight: 700;
        }
        .item-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1a1a1a;
        }
        .cart-summary-card {
          background: #fff;
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid #f0f0f0;
          position: sticky;
          top: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }
        .summary-title {
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          color: #666;
        }
        .summary-divider {
          height: 1px;
          background: #eee;
          margin: 1.5rem 0;
          border-top: 2px dashed #f5f5f5;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 2rem;
        }
        .btn-checkout {
          background: #1a1a1a;
          border: none;
          border-radius: 15px;
          padding: 1rem;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s;
        }
        .btn-checkout:hover {
          background: #333;
          transform: translateY(-2px);
        }
        /* Empty State */
        .empty-cart-container {
          padding: 5rem 1rem;
        }
        .empty-icon-wrapper {
          width: 120px;
          height: 120px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 10px 20px rgba(0,0,0,0.03);
          color: #ddd;
        }
        .btn-fashion-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 30px;
          border: 2px solid #1a1a1a;
          border-radius: 50px;
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s;
        }
        .btn-fashion-outline:hover {
          background: #1a1a1a;
          color: #fff;
        }
      `}</style>

      {cartItems.length === 0 ? (
        <div className="empty-cart-container text-center">
          <div className="empty-icon-wrapper">
            <FiShoppingBag size={50} />
          </div>
          <h2 className="mt-4 fw-bold">سبد خرید شما خالی است!</h2>
          <p className="text-muted mb-5">به نظر می‌رسد هنوز محصولی را انتخاب نکرده‌اید.</p>
          <Link to="/" className="btn-fashion-outline">
            بازگشت به فروشگاه <FiArrowLeft />
          </Link>
        </div>
      ) : (
        <>
          <h1 className="page-title mb-5 text-center text-lg-start">سبد خرید <span style={{fontSize: '1.2rem', color: '#aaa'}}>({totalItems} کالا)</span></h1>

          <Row className="g-4">
            <Col lg={8}>
              <div className="cart-items-container">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-img">
                       <Image src={item.image} alt={item.name} />
                    </div>

                    <div className="cart-item-details">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <span className="text-muted small d-block mb-1">{item.brand || 'Luxury Collection'}</span>
                          <Link to={`/product/${item._id}`} className="cart-item-title">
                            {item.name}
                          </Link>
                        </div>
                        <button 
                          className="remove-btn" 
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      <div className="cart-item-footer">
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

                         <div className="item-price">
                            {(item.price * item.qty).toLocaleString()} <span style={{fontSize: '0.7rem', color: '#888'}}>تومان</span>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            <Col lg={4}>
              <div className="cart-summary-card">
                <h4 className="summary-title">خلاصه سفارش</h4>
                
                <div className="summary-row">
                  <span>قیمت کالاها ({totalItems})</span>
                  <span>{totalPrice.toLocaleString()} تومان</span>
                </div>
                
                <div className="summary-row text-success">
                  <span>هزینه ارسال</span>
                  <span style={{fontWeight: '700'}}>رایگان</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>قابل پرداخت</span>
                  <span>{totalPrice.toLocaleString()} <span style={{fontSize: '0.8rem'}}>تومان</span></span>
                </div>

                <Button
                  type='button'
                  className='btn-checkout w-100 mb-3'
                  onClick={checkoutHandler}
                >
                  تایید و ادامه فرآیند خرید
                </Button>

                <div style={{fontSize: '0.8rem', color: '#aaa', textAlign: 'center'}}>
                    کالاهای موجود در سبد خرید رزرو نشده‌اند؛ برای نهایی کردن خرید، فرآیند پرداخت را تکمیل کنید.
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default CartScreen;