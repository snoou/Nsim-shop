import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios'; // اضافه کردن اکسیروس برای درخواست لینک
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { search } = useLocation(); // برای بررسی بازگشت از بانک

  const [loadingPay, setLoadingPay] = useState(false); // استیت لودینگ دستی برای زرین‌پال

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // --- بررسی وضعیت بازگشت از درگاه بانک ---
  useEffect(() => {
    const sp = new URLSearchParams(search);
    const status = sp.get('status');
    
    if (status === 'success') {
      toast.success('پرداخت با موفقیت انجام شد');
      refetch(); // رفرش کردن اطلاعات سفارش برای سبز شدن وضعیت
    } else if (status === 'failed') {
      toast.error('پرداخت ناموفق بود');
    }
  }, [search, refetch]);

  // --- تابع اتصال به درگاه زرین‌پال ---
  const paymentHandler = async () => {
    try {
      setLoadingPay(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // درخواست به بک‌اند برای گرفتن لینک
      const { data } = await axios.post(
        `/api/orders/${orderId}/pay`,
        {},
        config
      );

      setLoadingPay(false);

      if (data.paymentUrl) {
        // هدایت کاربر به درگاه بانک
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      setLoadingPay(false);
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('سفارش تحویل داده شد');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // --- استایل‌های اختصاصی ---
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
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: '800',
      marginBottom: '1.5rem',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    layoutGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '1.5rem',
      width: '100%',
      alignItems: 'start',
    },
    mainColumn: {
      gridColumn: 'span 8',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      minWidth: 0,
    },
    sideColumn: {
      gridColumn: 'span 4',
      position: 'sticky',
      top: '1rem',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
      border: '1px solid #f0f0f0',
      textAlign: 'right',
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      borderBottom: '1px solid #eee',
      paddingBottom: '0.8rem',
      color: '#444',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    infoGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem',
    },
    infoItem: {
      flex: '1 1 250px',
      minWidth: 0,
      marginBottom: '1rem',
    },
    label: {
      fontSize: '0.85rem',
      color: '#888',
      marginBottom: '0.4rem',
      display: 'block',
    },
    valueText: {
      fontSize: '1.05rem',
      lineHeight: '1.7',
      color: '#1a1a1a',
      fontWeight: '500',
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      wordBreak: 'break-word',
    },
    productItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 0',
      borderBottom: '1px solid #f9f9f9',
    },
    productImage: {
      width: '60px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
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
      color: '#555',
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
    deliverBtn: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    // استایل دکمه پرداخت
    payBtn: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#fdd835', // رنگ زرد زرین‌پال
      color: '#000',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '1rem',
      boxShadow: '0 4px 12px rgba(253, 216, 53, 0.3)',
      transition: 'all 0.3s ease',
    },
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <div style={styles.pageContainer}>
      <style>
        {`
          @media (max-width: 992px) {
            .grid-container { grid-template-columns: 1fr !important; }
            .main-col, .side-col { grid-column: span 1 !important; width: 100% !important; }
            .side-col { position: static !important; order: -1; margin-bottom: 2rem; }
          }
          .ltr-num { direction: ltr; display: inline-block; }
        `}
      </style>

      <div style={styles.contentWrapper}>
        <h1 style={styles.headerTitle}>
          سفارش <span style={{color: '#888', fontSize: '1.2rem'}}>#{order._id}</span>
        </h1>

        <div className="grid-container" style={styles.layoutGrid}>
          
          {/* --- ستون اصلی --- */}
          <div className="main-col" style={styles.mainColumn}>
            
            {/* کارت اطلاعات تحویل */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>اطلاعات تحویل</h2>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.label}>گیرنده</span>
                  <div style={styles.valueText}>{order.user.name}</div>
                  <div style={{fontSize:'0.9rem', color:'#666'}}>{order.user.email}</div>
                </div>
                
                <div style={styles.infoItem}>
                  <span style={styles.label}>نشانی پستی</span>
                  <div style={styles.valueText}>
                    {order.shippingAddress.address}، {order.shippingAddress.city}
                    <br />
                    کد پستی: {order.shippingAddress.postalCode}
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '1rem'}}>
                {order.isDelivered ? (
                  <Message variant='success'>تحویل شده در {order.deliveredAt}</Message>
                ) : (
                  <Message variant='danger'>هنوز ارسال نشده است</Message>
                )}
              </div>
            </div>

            {/* کارت روش پرداخت */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>روش پرداخت</h2>
              <div style={styles.infoItem}>
                <div style={styles.valueText}>{order.paymentMethod}</div>
              </div>
              {order.isPaid ? (
                <Message variant='success'>پرداخت شده در {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>پرداخت انجام نشده</Message>
              )}
            </div>

            {/* کارت اقلام سفارش */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>اقلام خریداری شده</h2>
              {order.orderItems.length === 0 ? (
                <Message>سفارش خالی است</Message>
              ) : (
                <div>
                  {order.orderItems.map((item, index) => (
                    <div key={index} style={styles.productItem}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={styles.productImage}
                      />
                      <Link to={`/product/${item.product}`} style={styles.productName}>
                        {item.name}
                      </Link>
                      
                      <div style={{textAlign: 'left', minWidth: '90px'}}>
                        <div style={{fontSize: '0.85rem', color: '#888'}}>
                           {item.qty} عدد
                        </div>
                        <div className="ltr-num" style={{fontWeight: '700'}}>
                          ${item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- ستون کناری (خلاصه وضعیت) --- */}
          <div className="side-col" style={styles.sideColumn}>
            <div style={styles.card}>
              <h2 style={{...styles.sectionTitle, textAlign: 'center'}}>فاکتور</h2>
              
              <div style={styles.summaryRow}>
                <span>جمع اقلام</span>
                <span className="ltr-num">${order.itemsPrice}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>هزینه ارسال</span>
                <span className="ltr-num">${order.shippingPrice}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>مالیات</span>
                <span className="ltr-num">${order.taxPrice}</span>
              </div>

              <div style={styles.totalRow}>
                <span>مبلغ نهایی</span>
                <span className="ltr-num">${order.totalPrice}</span>
              </div>

              {/* دکمه‌های پرداخت جدید زرین‌پال */}
              {!order.isPaid && (
                <div style={{marginTop: '1.5rem'}}>
                  {loadingPay && <Loader />}
                  
                  <button 
                    type="button" 
                    style={styles.payBtn}
                    onClick={paymentHandler}
                    disabled={loadingPay}
                  >
                    پرداخت آنلاین با زرین‌پال
                  </button>
                </div>
              )}

              {loadingDeliver && <Loader />}

              {/* دکمه ادمین برای تغییر وضعیت به ارسال شده */}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <button
                    type='button'
                    style={styles.deliverBtn}
                    onClick={deliverHandler}
                  >
                    علامت‌گذاری به عنوان ارسال شده
                  </button>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderScreen;