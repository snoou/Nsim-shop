import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiStar } from 'react-icons/fi';

import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const increaseQty = () => {
    if (product && qty < product.countInStock) setQty(qty + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  // ... (توابع submitHandler مثل قبل) ...
    const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="fashion-showcase">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta title={product.name} image={product.image} />

          {/* دکمه بازگشت شناور */}
          <Link to="/" className="position-absolute top-0 start-0 m-4 text-dark bg-white p-2 rounded-circle shadow-sm" style={{zIndex: 200}}>
             <FiArrowRight size={24} />
          </Link>

          {/* بخش ۱: گالری عکس (اسلایدر) */}
          <div className="gallery-container">
            {/* فعلاً چون یک عکس داریم، همون یکی رو نشون میدیم */}
            <div className="gallery-item">
               <img src={product.image} alt={product.name} className="gallery-img" />
            </div>
            {/* اگر عکس‌های بیشتری داشتی، اینجا div های بعدی رو تکرار می‌کردیم تا اسکرول بشن */}
          </div>

          {/* بخش ۲: اطلاعات شناور روی صفحه */}
          <div className="product-overlay-info">
             <div className="mb-2">
                <span className="showcase-brand">{product.brand || 'Luxury Brand'}</span>
             </div>
             <h1 className="showcase-title">{product.name}</h1>
             
             <div className="showcase-desc">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <Rating value={product.rating} text={`(${product.numReviews})`} />
                    <span className={product.countInStock > 0 ? 'text-success small fw-bold' : 'text-danger small fw-bold'}>
                       {product.countInStock > 0 ? '● موجود' : '● ناموجود'}
                    </span>
                </div>
                <p className="mb-0 text-justify">
                   {product.description}
                </p>
             </div>
          </div>

          {/* بخش ۳: نوار ابزار پایین (Action Bar) - همه چیز در یک خط */}
          <div className="action-bar-container">
             
             {/* قیمت */}
             <div className="bar-price">
                {product.price.toLocaleString()} <span className="currency">تومان</span>
             </div>

             {/* اگر کالا موجود باشه، کنترلرها رو نشون میدیم */}
             {product.countInStock > 0 ? (
                <>
                  {/* انتخاب تعداد (افقی و گرد) */}
                  <div className="bar-qty">
                     <button className="qty-btn-round" onClick={decreaseQty} disabled={qty <= 1}>
                        <FiMinus />
                     </button>
                     <div className="qty-display">{qty}</div>
                     <button className="qty-btn-round" onClick={increaseQty} disabled={qty >= product.countInStock}>
                        <FiPlus />
                     </button>
                  </div>

                  {/* دکمه افزودن */}
                  <button className="bar-add-btn" onClick={addToCartHandler}>
                     <FiShoppingBag size={20} />
                     <span>افزودن به سبد</span>
                  </button>
                </>
             ) : (
                <button className="bar-add-btn bg-secondary" disabled>
                   ناموجود
                </button>
             )}
          </div>

          {/* فضای خالی پایین برای اینکه نوار ابزار روی محتوای بعدی نیاد */}
          <div style={{height: '120px'}}></div>

          {/* بخش نظرات (پایین صفحه) */}
           {/* ... کد بخش نظرات رو اینجا می‌تونی مثل قبل بذاری یا ساده‌ترش کنی ... */}
           {/* برای شلوغ نشدن کد، بخش نظرات رو خلاصه کردم، اما حتما باید باشه */}
        </>
      )}
    </div>
  );
};

export default ProductScreen;