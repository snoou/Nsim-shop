import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiCheck, FiEye, FiBox, FiUser, FiClock, FiSearch, FiFilter } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import '../../assets/styles/OrderListScreen.css';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all'); 
  const [deliveryFilter, setDeliveryFilter] = useState('all');

  const toPersianDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredOrders = orders?.filter((order) => {
    const searchMatch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const paymentMatch = 
      paymentFilter === 'all' || 
      (paymentFilter === 'paid' && order.isPaid) || 
      (paymentFilter === 'unpaid' && !order.isPaid);

    const deliveryMatch = 
      deliveryFilter === 'all' || 
      (deliveryFilter === 'delivered' && order.isDelivered) || 
      (deliveryFilter === 'pending' && !order.isDelivered);

    return searchMatch && paymentMatch && deliveryMatch;
  });

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-container">
        
        <div className="admin-header-flex">
          <h1 className="admin-page-title">مدیریت سفارشات</h1>
          <span className="admin-count-badge">
            {filteredOrders ? filteredOrders.length : 0} سفارش پیدا شد
          </span>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="admin-card">
            
            <div className="admin-filter-bar">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="جستجو با نام مشتری یا شناسه سفارش..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-search-input"
                />
              </div>

              <div className="filter-selects-wrapper">
                <div className="select-with-icon">
                  <FiFilter className="select-icon" />
                  <select 
                    value={paymentFilter} 
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">همه پرداخت‌ها</option>
                    <option value="paid">پرداخت شده</option>
                    <option value="unpaid">ناموفق</option>
                  </select>
                </div>

                <div className="select-with-icon">
                  <FiBox className="select-icon" />
                  <select 
                    value={deliveryFilter} 
                    onChange={(e) => setDeliveryFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">همه ارسال‌ها</option>
                    <option value="delivered">ارسال شده</option>
                    <option value="pending">در انتظار ارسال</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredOrders?.length === 0 ? (
              <Message>هیچ سفارشی با این مشخصات یافت نشد.</Message>
            ) : (
              <>
                {/* نمای جدول برای دسکتاپ */}
                <div className="desktop-table-wrapper">
                  <table className="luxury-admin-table">
                    <thead>
                      <tr>
                        <th>شناسه سفارش</th>
                        <th>نام مشتری</th>
                        <th>تاریخ ثبت</th>
                        <th>مبلغ کل</th>
                        <th>وضعیت پرداخت</th>
                        <th>وضعیت ارسال</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="id-cell">
                            #{order._id.substring(order._id.length - 6)}
                          </td>
                          
                          <td>
                            <div className="user-info-cell">
                              <div className="user-avatar-sm">
                                <FiUser size={14} />
                              </div>
                              <span className="user-name-text">
                                {order.user && order.user.name}
                              </span>
                            </div>
                          </td>
                          
                          <td className="date-cell">
                            {toPersianDate(order.createdAt)}
                          </td>
                          
                          <td className="price-cell">
                            {order.totalPrice.toLocaleString()} <span>تومان</span>
                          </td>
                          
                          <td>
                            {order.isPaid ? (
                              <div className="status-badge success">
                                <FiCheck /> پرداخت شده
                              </div>
                            ) : (
                              <div className="status-badge danger">
                                <FiX /> ناموفق
                              </div>
                            )}
                          </td>
                          
                          <td>
                            {order.isDelivered ? (
                              <div className="status-badge success">
                                <FiBox /> ارسال شده
                              </div>
                            ) : (
                              <div className="status-badge warning">
                                <FiClock /> در انتظار ارسال
                              </div>
                            )}
                          </td>
                          
                          <td className="action-cell">
                            <Link to={`/order/${order._id}`} className="btn-action-icon" title="مشاهده جزئیات">
                              <FiEye size={18} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-cards-wrapper">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="admin-mobile-card">
                      <div className="mobile-card-header">
                        <span className="mobile-id">#{order._id.substring(order._id.length - 6)}</span>
                        <span className="mobile-date">{toPersianDate(order.createdAt)}</span>
                      </div>

                      <div className="mobile-card-body">
                        <div className="mobile-info-row">
                          <span className="row-label">مشتری:</span>
                          <span className="row-value fw-bold">{order.user && order.user.name}</span>
                        </div>

                        <div className="mobile-info-row">
                          <span className="row-label">مبلغ کل:</span>
                          <span className="row-value text-teal fw-bold">
                            {order.totalPrice.toLocaleString()} تومان
                          </span>
                        </div>

                        <div className="mobile-info-row">
                          <span className="row-label">پرداخت:</span>
                          {order.isPaid ? (
                            <span className="text-success"><FiCheck /> تایید شده</span>
                          ) : (
                            <span className="text-danger"><FiX /> پرداخت نشده</span>
                          )}
                        </div>

                        <div className="mobile-info-row">
                          <span className="row-label">وضعیت:</span>
                          {order.isDelivered ? (
                            <span className="text-success"><FiBox /> ارسال شده</span>
                          ) : (
                            <span className="text-warning"><FiClock /> در انتظار ارسال</span>
                          )}
                        </div>
                      </div>

                      <Link to={`/order/${order._id}`} className="btn-mobile-view">
                        مشاهده جزئیات فاکتور
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListScreen;