import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

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

  // --- استایل‌های اصلاح شده و هماهنگ ---
  const styles = {
    pageContainer: {
      backgroundColor: '#F9F9F7',
      minHeight: '100vh',
      width: '100%',
      padding: '2rem 1rem',
      fontFamily: "'Vazirmatn', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      direction: 'rtl',
    },
    contentWrapper: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    // گرید سیستم
    layoutGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '1.5rem',
      width: '100%',
      alignItems: 'start',
    },
    // ستون سمت راست (آدرس و محصولات)
    mainColumn: {
      gridColumn: 'span 8', 
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      minWidth: 0,
    },
    // ستون سمت چپ (فاکتور)
    sideColumn: {
      gridColumn: 'span 4',
      position: 'sticky',
      top: '1rem',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '24px', // کمی گردتر برای زیبایی بیشتر
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: '1px solid #f0f0f0',
      textAlign: 'right',
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      borderBottom: '1px solid #eee',
      paddingBottom: '1rem',
      color: '#333',
    },
    infoContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem',
    },
    infoBlock: {
      flex: '1 1 280px',
      minWidth: 0,
      marginBottom: '1rem',
    },
    label: {
      fontSize: '0.85rem',
      color: '#999',
      marginBottom: '0.5rem',
      display: 'block',
      fontWeight: '500',
    },
    valueText: {
      fontSize: '1.1rem',
      lineHeight: '1.7',
      color: '#1a1a1a',
      fontWeight: '500',
      overflowWrap: 'break-word',
    },
    productItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 0',
      borderBottom: '1px solid #f9f9f9',
    },
    productImage: {
      width: '70px',
      height: '90px',
      objectFit: 'cover',
      borderRadius: '12px',
      backgroundColor: '#f8f8f8',
    },
    productName: {
      flex: 1,
      fontSize: '1rem',
      color: '#333',
      textDecoration: 'none',
      fontWeight: '600',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      fontSize: '0.95rem',
      color: '#666',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1.5rem',
      paddingTop: '1rem',
      borderTop: '2px dashed #eee',
      fontSize: '1.4rem',
      fontWeight: '800',
      color: '#000',
    },
    button: {
      width: '100%',
      padding: '1.2rem',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '1.5rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <style>
        {`
          @media (max-width: 992px) {
            .grid-container { grid-template-columns: 1fr !important; }
            .main-col, .side-col { grid-column: span 1 !important; width: 100% !important; }
            .side-col { position: static !important; order: -1; margin-bottom: 1.5rem; }
          }
          .ltr-text { direction: ltr; display: inline-block; }
          .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.15); }
        `}
      </style>

      <div style={styles.contentWrapper}>
        <CheckoutSteps step1 step2 step3 step4 />

        <div className="grid-container" style={styles.layoutGrid}>
          
          {/* --- ستون اصلی --- */}
          <div className="main-col" style={styles.mainColumn}>
            
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>اطلاعات ارسال و پرداخت</h2>
              
              <div style={styles.infoContainer}>
                <div style={styles.infoBlock}>
                  <span style={styles.label}>آدرس تحویل گیرنده</span>
                  <div style={styles.valueText}>
                    {cart.shippingAddress.address}، {cart.shippingAddress.city}
                    <br />
                    کد پستی: {cart.shippingAddress.postalCode}
                  </div>
                </div>

                <div style={styles.infoBlock}>
                  <span style={styles.label}>روش پرداخت</span>
                  <div style={styles.valueText}>
                    {/* نمایش زیباتر نام درگاه */}
                    {cart.paymentMethod === 'ZarinPal' 
                      ? 'درگاه پرداخت زرین‌پال' 
                      : cart.paymentMethod}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>اقلام سفارش ({cart.cartItems.length})</h2>
              {cart.cartItems.length === 0 ? (
                <Message>سبد خرید شما خالی است</Message>
              ) : (
                <div>
                  {cart.cartItems.map((item, index) => (
                    <div key={index} style={styles.productItem}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={styles.productImage}
                      />
                      <Link to={`/product/${item.product}`} style={styles.productName}>
                        {item.name}
                      </Link>
                      
                      <div style={{textAlign: 'left', minWidth: '80px'}}>
                        <div style={{fontSize: '0.8rem', color: '#888'}}>
                          {item.qty} عدد
                        </div>
                        <div className="ltr-text" style={{fontWeight: '700'}}>
                          ${item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- ستون کناری --- */}
          <div className="side-col" style={styles.sideColumn}>
            <div style={styles.card}>
              <h2 style={{...styles.sectionTitle, textAlign: 'center', borderBottom: 'none'}}>خلاصه سفارش</h2>
              
              <div style={styles.summaryRow}>
                <span>قیمت کالاها</span>
                <span className="ltr-text">${cart.itemsPrice}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>هزینه ارسال</span>
                <span className="ltr-text">${cart.shippingPrice}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>مالیات</span>
                <span className="ltr-text">${cart.taxPrice}</span>
              </div>

              <div style={styles.totalRow}>
                <span>مبلغ کل</span>
                <span className="ltr-text">${cart.totalPrice}</span>
              </div>

              {error && (
                <div style={{marginTop: '1rem'}}>
                   <Message variant='danger'>{error?.data?.message || error.error}</Message>
                </div>
              )}

              <button
                type='button'
                style={styles.button}
                className="btn-hover"
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                {isLoading ? 'در حال ثبت...' : 'ثبت سفارش و پرداخت'}
              </button>
              
              {isLoading && <div style={{marginTop: '10px', textAlign: 'center'}}><Loader /></div>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;