import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getOrders,
  startPayment,       
  verifyPaymentCallback 
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);

router.route('/payment/verify').get(verifyPaymentCallback);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/pay').post(protect, startPayment);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;