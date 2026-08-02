import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps'; 

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // تغییر پیش‌فرض به ZarinPal
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

  // --- استایل‌های مدرن ۲۰۲۶ ---
  const styles = {
    pageContainer: {
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F9F9F7',
      fontFamily: "'Vazirmatn', sans-serif", // اولویت با فونت فارسی
      padding: '2rem',
    },
    glassCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 1)',
      padding: '3rem',
      width: '100%',
      maxWidth: '550px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
      animation: 'fadeInUp 0.6s ease-out',
    },
    header: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1a1a1a',
      textAlign: 'center',
      marginBottom: '2.5rem',
      letterSpacing: '-0.5px',
    },
    labelLegend: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#888',
      marginBottom: '1.5rem',
      display: 'block',
      textAlign: 'center',
    },
    selectionGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginBottom: '3rem',
    },
    // کارت انتخاب روش پرداخت
    paymentCard: (isActive) => ({
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderRadius: '16px',
      cursor: 'pointer',
      border: isActive ? '2px solid #fdd835' : '1.5px solid #e5e5e5', // رنگ زرد برای زرین‌پال
      background: isActive ? '#fffcf0' : 'transparent', // پس‌زمینه خیلی روشن زرد
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isActive ? '0 10px 25px rgba(253, 216, 53, 0.15)' : 'none',
    }),
    cardContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    iconWrapper: {
      width: '45px',
      height: '45px',
      borderRadius: '12px',
      background: '#fff',
      border: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#fdd835',
    },
    paymentText: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#1a1a1a',
      fontFamily: "'Vazirmatn', sans-serif",
    },
    subText: {
        fontSize: '0.85rem',
        color: '#666',
        marginTop: '4px',
        fontWeight: '400'
    },
    // دکمه انتخاب
    customRadio: (isActive) => ({
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      border: isActive ? '6px solid #fdd835' : '2px solid #ccc',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff'
    }),
    submitBtn: {
      width: '100%',
      padding: '1.2rem',
      background: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, opacity 0.2s ease',
      fontFamily: "'Vazirmatn', sans-serif",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hover-scale:hover { transform: scale(1.02); }
        `}
      </style>

      <div style={{ marginBottom: '2rem', opacity: 0.9 }}>
        <CheckoutSteps step1 step2 step3 />
      </div>

      <div style={styles.glassCard}>
        <h1 style={styles.header}>روش پرداخت</h1>
        
        <form onSubmit={submitHandler}>
          <span style={styles.labelLegend}>درگاه بانکی مورد نظر را انتخاب کنید</span>
          
          <div style={styles.selectionGrid}>
            
            {/* گزینه زرین‌پال */}
            <div 
              style={styles.paymentCard(paymentMethod === 'ZarinPal')}
              onClick={() => setPaymentMethod('ZarinPal')}
            >
              <div style={styles.cardContent}>
                {/* آیکون کارت بانکی یا لوگوی زرین‌پال */}
                <div style={styles.iconWrapper}>💳</div>
                <div>
                  <div style={styles.paymentText}>پرداخت اینترنتی زرین‌پال</div>
                  <div style={styles.subText}>
                    پذیرش کلیه کارت‌های عضو شتاب
                  </div>
                </div>
              </div>
              
              <input
                type='radio'
                id='ZarinPal'
                name='paymentMethod'
                value='ZarinPal'
                checked={paymentMethod === 'ZarinPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ display: 'none' }}
              />
              
              <div style={styles.customRadio(paymentMethod === 'ZarinPal')}></div>
            </div>

            {/* اگر بخواهید در آینده گزینه دیگری اضافه کنید، اینجا کپی کنید */}
          
          </div>

          <button 
            type='submit' 
            style={styles.submitBtn}
            className="hover-scale"
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            ادامه و ثبت نهایی
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;