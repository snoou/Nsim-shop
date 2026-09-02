import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiMapPin, FiCreditCard, FiPackage, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';
import '../assets/styles/OrderScreen.css'

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { search } = useLocation();

  const [loadingPay, setLoadingPay] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const sp = new URLSearchParams(search);
    const status = sp.get('status');
    
    if (status === 'success') {
      toast.success('پرداخت با موفقیت انجام شد');
      refetch();
    } else if (status === 'failed') {
      toast.error('پرداخت ناموفق بود');
    }
  }, [search, refetch]);

  const paymentHandler = async () => {
    try {
      setLoadingPay(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/orders/${orderId}/pay`,
        {},
        config
      );

      setLoadingPay(false);

      if (data.paymentUrl) {
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

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  return (
    <div className="luxury-order-wrapper">
      <div className="order-container">
        
        {/* هدر صفحه سفارش */}
        <div className="order-header">
          <h1 className="order-main-title">جزئیات سفارش</h1>
          <span className="order-id-badge">#{order._id}</span>
        </div>

        <div className="order-grid-layout">
          
          <div className="order-main-column">
            
            <div className="luxury-order-card">
              <h2 className="card-section-title">
                <FiMapPin className="section-icon" /> اطلاعات تحویل
              </h2>
              <div className="info-details-grid">
                <div className="info-block">
                  <span className="info-label">گیرنده</span>
                  <strong className="info-value">{order.user.name}</strong>
                  <span className="info-sub-value">{order.user.email}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">نشانی پستی</span>
                  <span className="info-value">
                    {order.shippingAddress.address}، {order.shippingAddress.city}
                  </span>
                  <span className="info-sub-value">کد پستی: {order.shippingAddress.postalCode}</span>
                </div>
              </div>
              
              <div className={`status-alert ${order.isDelivered ? 'alert-success' : 'alert-warning'}`}>
                {order.isDelivered ? (
                  <><FiCheckCircle /> تحویل شده در {order.deliveredAt.substring(0, 10)}</>
                ) : (
                  <><FiXCircle /> هنوز ارسال نشده است</>
                )}
              </div>
            </div>

            <div className="luxury-order-card">
              <h2 className="card-section-title">
                <FiCreditCard className="section-icon" /> روش پرداخت
              </h2>
              <div className="info-block mb-3">
                <strong className="info-value">{order.paymentMethod}</strong>
              </div>
              
              <div className={`status-alert ${order.isPaid ? 'alert-success' : 'alert-danger'}`}>
                {order.isPaid ? (
                  <><FiCheckCircle /> پرداخت شده در {order.paidAt.substring(0, 10)}</>
                ) : (
                  <><FiXCircle /> پرداخت انجام نشده</>
                )}
              </div>
            </div>

            <div className="luxury-order-card">
              <h2 className="card-section-title">
                <FiPackage className="section-icon" /> اقلام خریداری شده
              </h2>
              
              {order.orderItems.length === 0 ? (
                <Message>سفارش خالی است</Message>
              ) : (
                <div className="order-items-list">
                  {order.orderItems.map((item, index) => (
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

          <div className="order-sidebar">
            <div className="invoice-card">
              <h3 className="invoice-title">فاکتور نهایی</h3>
              
              <div className="invoice-row">
                <span className="invoice-label">جمع اقلام</span>
                <span className="invoice-value">{Number(order.itemsPrice).toLocaleString()} تومان</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">هزینه ارسال</span>
                <span className="invoice-value text-teal">{Number(order.shippingPrice) === 0 ? 'رایگان' : `${Number(order.shippingPrice).toLocaleString()} تومان`}</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">مالیات</span>
                <span className="invoice-value">{Number(order.taxPrice).toLocaleString()} تومان</span>
              </div>

              <hr className="invoice-divider" />

              <div className="invoice-total">
                <span>مبلغ نهایی</span>
                <div className="total-amount">
                  {Number(order.totalPrice).toLocaleString()} <small>تومان</small>
                </div>
              </div>

              {!order.isPaid && (
                <div className="payment-action-box">
                  {loadingPay && <Loader />}
                  <button 
                    type="button" 
                    className="btn-zarinpal"
                    onClick={paymentHandler}
                    disabled={loadingPay}
                  >
                    <FiCreditCard size={20} />
                    پرداخت آنلاین با زرین‌پال
                  </button>
                  <span className="payment-note">انتقال امن به درگاه بانکی</span>
                </div>
              )}

              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <button
                  type="button"
                  className="btn-admin-deliver"
                  onClick={deliverHandler}
                >
                  تأیید ارسال کالا (پنل ادمین)
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