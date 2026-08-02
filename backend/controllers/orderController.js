import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { requestPayment, verifyPayment } from '../utils/zarinpal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Start Zarinpal Payment (Get Gateway URL)
// @route   POST /api/orders/:id/pay
// @access  Private
const startPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email mobile');

  if (order) {
    // تبدیل به عدد صحیح برای جلوگیری از خطای 422 زرین‌پال
    const amount = Math.round(order.totalPrice);

    if (amount < 100) {
      res.status(400);
      throw new Error('مبلغ تراکنش باید حداقل ۱۰۰ تومان باشد.');
    }

    const callbackUrl = `http://localhost:5000/api/orders/payment/verify?amount=${amount}&orderId=${order._id}`;
    const description = `Payment for Order ID: ${order._id}`;
    const email = order.user ? order.user.email : '';
    const mobile = order.user ? order.user.mobile : '';

    try {
      const zarinpalResponse = await requestPayment(
        amount,
        callbackUrl,
        description,
        email,
        mobile
      );
      
      res.json({ paymentUrl: zarinpalResponse.paymentUrl });
    } catch (error) {
      console.error('Zarinpal Error:', error?.response?.data || error.message);
      res.status(400);
      throw new Error('خطا در ایجاد تراکنش: ' + (error?.response?.data?.errors?.message || error.message));
    }

  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Verify Zarinpal Payment (Callback from Bank)
// @route   GET /api/orders/payment/verify
// @access  Public
const verifyPaymentCallback = asyncHandler(async (req, res) => {
  const { Authority, Status, amount, orderId } = req.query;

  if (Status === 'NOK') {
    return res.redirect(`http://localhost:3000/order/${orderId}?status=failed`);
  }

  try {
    const verification = await verifyPayment(amount, Authority);

    if (verification.code === 100 || verification.code === 101) {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: verification.ref_id,
          status: 'success',
          update_time: Date.now(),
          email_address: '',
        };
        await order.save();
        res.redirect(`http://localhost:3000/order/${orderId}?status=success`);
      }
    } else {
      res.redirect(`http://localhost:3000/order/${orderId}?status=failed`);
    }
  } catch (error) {
    console.error('Verify Error:', error);
    res.redirect(`http://localhost:3000/order/${orderId}?status=error`);
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// مهم: تمام توابع باید اینجا اکسپورت شوند
export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  startPayment,
  verifyPaymentCallback,
  updateOrderToDelivered,
  getOrders,
};