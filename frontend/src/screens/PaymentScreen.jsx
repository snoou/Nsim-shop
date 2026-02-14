import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
// فرض بر این است که CheckoutSteps را دارید، اما ما استایل دور آن را تغییر می‌دهیم
import CheckoutSteps from '../components/CheckoutSteps'; 

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [hovered, setHovered] = useState(null);

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
      background: '#F9F9F7', // رنگ استخوانی مدرن
      fontFamily: "'Playfair Display', serif", // پیشنهاد فونت لوکس
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
      fontSize: '2.5rem',
      fontWeight: '600',
      color: '#1a1a1a',
      textAlign: 'center',
      marginBottom: '2.5rem',
      letterSpacing: '-1px',
    },
    labelLegend: {
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
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
    // کارت انتخاب روش پرداخت (جایگزین رادیو باتن)
    paymentCard: (isActive) => ({
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderRadius: '16px',
      cursor: 'pointer',
      border: isActive ? '1.5px solid #1a1a1a' : '1.5px solid #e5e5e5',
      background: isActive ? '#fff' : 'transparent',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isActive ? '0 10px 25px rgba(0,0,0,0.05)' : 'none',
    }),
    cardContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    iconWrapper: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
    },
    paymentText: {
      fontSize: '1.1rem',
      fontWeight: '500',
      color: '#1a1a1a',
      fontFamily: "'Vazirmatn', sans-serif", // فونت متن اصلی
    },
    // دکمه سفارشی رادیو
    customRadio: (isActive) => ({
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: isActive ? '6px solid #1a1a1a' : '2px solid #ccc',
      transition: 'all 0.3s ease',
    }),
    submitBtn: {
      width: '100%',
      padding: '1.2rem',
      background: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, opacity 0.2s ease',
      letterSpacing: '1px',
    },
  };

  return (
    <div style={styles.pageContainer}>
      {/* استایل گلوبال برای انیمیشن */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hover-scale:hover { transform: scale(1.02); }
        `}
      </style>

      {/* فرض بر این است که این کامپوننت فقط دایره‌های مراحل را نشان می‌دهد */}
      <div style={{ marginBottom: '2rem', opacity: 0.7 }}>
        <CheckoutSteps step1 step2 step3 />
      </div>

      <div style={styles.glassCard}>
        <h1 style={styles.header}>روش پرداخت</h1>
        
        <form onSubmit={submitHandler}>
          <span style={styles.labelLegend}>انتخاب درگاه امن</span>
          
          <div style={styles.selectionGrid}>
            {/* گزینه پی‌پال / کیف پول دیجیتال */}
            <div 
              style={styles.paymentCard(paymentMethod === 'PayPal')}
              onClick={() => setPaymentMethod('PayPal')}
              onMouseEnter={() => setHovered('PayPal')}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.cardContent}>
                <div style={styles.iconWrapper}>💳</div>
                <div>
                  <div style={styles.paymentText}>PayPal / Credit Card</div>
                  <div style={{fontSize: '0.8rem', color: '#888', marginTop: '4px'}}>
                    پرداخت امن بین‌المللی
                  </div>
                </div>
              </div>
              
              {/* اینپوت مخفی برای کارکرد فرم */}
              <input
                type='radio'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ display: 'none' }}
              />
              
              <div style={styles.customRadio(paymentMethod === 'PayPal')}></div>
            </div>

            {/* می‌توانید گزینه‌های بیشتری در آینده اضافه کنید، مثلا پرداخت در محل */}
             {/* <div style={styles.paymentCard(false)} ... > ... </div> */}
          
          </div>

          <button 
            type='submit' 
            style={styles.submitBtn}
            className="hover-scale"
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            ادامه و بررسی نهایی
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
