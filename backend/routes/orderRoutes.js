import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getOrders,
  startPayment,        // تابع جدید اضافه شد
  verifyPaymentCallback // تابع جدید اضافه شد
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// روت‌های اصلی
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);

// -----------------------------------------------------------------------------
// روت بازگشت از بانک (Verify)
// نکته مهم: این خط حتما باید قبل از route('/:id') باشد
// چون اکسپرس خط به خط می‌خواند، اگر پایین‌تر باشد، کلمه 'payment' را به عنوان ID در نظر می‌گیرد.
// -----------------------------------------------------------------------------
router.route('/payment/verify').get(verifyPaymentCallback);

// روت دریافت سفارش با ID
router.route('/:id').get(protect, getOrderById);

// روت شروع پرداخت (درخواست اتصال به زرین‌پال)
// متد را به POST تغییر دادیم چون داریم یک تراکنش ایجاد می‌کنیم
router.route('/:id/pay').post(protect, startPayment);

// روت تغییر وضعیت به تحویل شده (مخصوص ادمین)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;