import { Table, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiX, FiCheck, FiEye, FiBox, FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // تابع کمکی برای تبدیل تاریخ میلادی به شمسی
  const toPersianDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="admin-title">مدیریت سفارشات</h1>
        <span className="admin-badge-count">{orders ? orders.length : 0} سفارش</span>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="table-responsive-custom">
          <Table hover className='align-middle modern-table'>
            <thead>
              <tr>
                <th>شناسه</th>
                <th>کاربر</th>
                <th>تاریخ ثبت</th>
                <th>مبلغ کل</th>
                <th>وضعیت پرداخت</th>
                <th>وضعیت ارسال</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td data-label="شناسه">
                    <span className="id-pill">#{order._id.substring(order._id.length - 6)}</span>
                  </td>
                  
                  <td data-label="کاربر">
                    <div className="d-flex align-items-center gap-2">
                      <div className="user-avatar-placeholder">
                        <FiUser />
                      </div>
                      <span className="fw-bold text-dark">
                        {order.user && order.user.name}
                      </span>
                    </div>
                  </td>
                  
                  <td data-label="تاریخ">
                    <span className="text-muted small">
                      {toPersianDate(order.createdAt)}
                    </span>
                  </td>
                  
                  <td data-label="مبلغ">
                    <strong className="text-dark">
                      {order.totalPrice.toLocaleString()} <span className="small text-muted">تومان</span>
                    </strong>
                  </td>
                  
                  <td data-label="پرداخت">
                    {order.isPaid ? (
                      <div className="status-badge success">
                        <FiCheck className="me-1" />
                        <span>پرداخت شد ({toPersianDate(order.paidAt)})</span>
                      </div>
                    ) : (
                      <div className="status-badge danger">
                        <FiX className="me-1" />
                        <span>ناموفق</span>
                      </div>
                    )}
                  </td>
                  
                  <td data-label="ارسال">
                    {order.isDelivered ? (
                      <div className="status-badge info">
                        <FiBox className="me-1" />
                        <span>ارسال شد ({toPersianDate(order.deliveredAt)})</span>
                      </div>
                    ) : (
                      <div className="status-badge warning">
                        <span className="spinner-grow spinner-grow-sm me-2" role="status" aria-hidden="true"></span>
                        <span>در انتظار ارسال</span>
                      </div>
                    )}
                  </td>
                  
                  <td data-label="عملیات">
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      variant='light'
                      className='action-btn-icon'
                      title="مشاهده جزئیات"
                    >
                      <FiEye size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;