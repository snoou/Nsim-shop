import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiStar, FiUser, FiCalendar } from 'react-icons/fi';

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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('نظر شما با موفقیت ثبت شد');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="fashion-showcase">
      {/* استایل‌های اختصاصی این صفحه */}
      <style>{`
        .fashion-showcase {
          background-color: #fff;
          padding-bottom: 100px; /* فضا برای نوار ابزار پایین */
          font-family: 'Vazirmatn', sans-serif;
          position: relative;
        }
        .gallery-container {
          width: 100%;
          height: 50vh;
          background: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .gallery-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .gallery-img:hover {
          transform: scale(1.05);
        }
        .product-overlay-info {
          padding: 2rem 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .showcase-brand {
          font-size: 0.9rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
        }
        .showcase-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0.5rem 0 1rem;
        }
        .showcase-desc {
          color: #555;
          line-height: 1.8;
          font-size: 1rem;
        }
        
        /* Action Bar Styles */
        .action-bar-container {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-radius: 20px;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1000;
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .bar-price {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1a1a1a;
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .bar-price .currency {
          font-size: 0.7rem;
          color: #888;
          font-weight: 400;
          margin-top: 2px;
        }
        .bar-qty {
          display: flex;
          align-items: center;
          background: #f0f0f0;
          border-radius: 30px;
          padding: 5px;
        }
        .qty-btn-round {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }
        .qty-btn-round:active { transform: scale(0.9); }
        .qty-display {
          width: 30px;
          text-align: center;
          font-weight: bold;
        }
        .bar-add-btn {
          background: #1a1a1a;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        .bar-add-btn:hover {
          background: #333;
        }
        .bar-add-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        /* Review Section */
        .reviews-section {
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1.5rem;
        }
        .review-card {
            background: #f9f9f9;
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }
        .form-control-custom {
            width: 100%;
            padding: 1rem;
            border: 1px solid #eee;
            border-radius: 12px;
            margin-bottom: 1rem;
            background: #f9f9f9;
        }
      `}</style>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta title={product.name} image={product.image} />

          {/* دکمه بازگشت شناور */}
          <Link to="/" className="position-absolute top-0 start-0 m-4 text-dark bg-white p-2 rounded-circle shadow-sm" style={{zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
             <FiArrowRight size={24} />
          </Link>

          {/* بخش ۱: گالری عکس */}
          <div className="gallery-container">
            <div className="gallery-item">
               <img src={product.image} alt={product.name} className="gallery-img" />
            </div>
          </div>

          {/* بخش ۲: اطلاعات محصول */}
          <div className="product-overlay-info">
             <div className="mb-2">
                <span className="showcase-brand">{product.brand || 'Luxury Brand'}</span>
             </div>
             <h1 className="showcase-title">{product.name}</h1>
             
             <div className="showcase-desc">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <Rating value={product.rating} text={`(${product.numReviews} نظر)`} />
                    <span className={product.countInStock > 0 ? 'text-success small fw-bold' : 'text-danger small fw-bold'}>
                       {product.countInStock > 0 ? '● موجود در انبار' : '● ناموجود'}
                    </span>
                </div>
                <p className="mb-0 text-justify" style={{textAlign: 'justify'}}>
                   {product.description}
                </p>
             </div>
          </div>

          {/* بخش ۳: نظرات کاربران */}
          <div className="reviews-section">
            <h3 className="mb-4 fw-bold">نظرات کاربران</h3>
            {product.reviews.length === 0 && <Message>هیچ نظری ثبت نشده است.</Message>}
            
            <div className="list-group list-group-flush">
              {product.reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                          <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 30, height: 30}}>
                              <FiUser size={14} />
                          </div>
                          <strong>{review.name}</strong>
                      </div>
                      <Rating value={review.rating} />
                  </div>
                  <div className="d-flex align-items-center gap-1 text-muted small mb-2">
                     <FiCalendar />
                     <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </div>
              ))}
              
              {/* فرم ارسال نظر */}
              <div className="mt-5">
                <h4 className="fw-bold mb-3">نظر خود را بنویسید</h4>
                {loadingProductReview && <Loader />}
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="mb-3">
                      <label className="form-label text-muted">امتیاز شما</label>
                      <select
                        className='form-control-custom'
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value=''>انتخاب کنید...</option>
                        <option value='1'>1 - ضعیف</option>
                        <option value='2'>2 - متوسط</option>
                        <option value='3'>3 - خوب</option>
                        <option value='4'>4 - خیلی خوب</option>
                        <option value='5'>5 - عالی</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted">دیدگاه شما</label>
                      <textarea
                        className='form-control-custom'
                        rows='3'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="نظرتان را اینجا بنویسید..."
                      ></textarea>
                    </div>
                    <button
                      disabled={loadingProductReview}
                      type='submit'
                      className='btn btn-dark w-100 rounded-pill py-2'
                    >
                      ارسال نظر
                    </button>
                  </form>
                ) : (
                  <Message>
                    لطفاً برای ثبت نظر <Link to='/login' className="text-decoration-underline">وارد شوید</Link>
                  </Message>
                )}
              </div>
            </div>
          </div>

          {/* بخش ۴: نوار ابزار پایین (Sticky Action Bar) */}
          <div className="action-bar-container">
             <div className="bar-price">
                <span className="currency">قیمت نهایی</span>
                <span>{product.price.toLocaleString()} تومان</span>
             </div>

             {product.countInStock > 0 ? (
                <div className="d-flex align-items-center gap-3">
                  {/* کنترل تعداد */}
                  <div className="bar-qty">
                     <button className="qty-btn-round" onClick={decreaseQty} disabled={qty <= 1}>
                        <FiMinus size={14} />
                     </button>
                     <div className="qty-display">{qty}</div>
                     <button className="qty-btn-round" onClick={increaseQty} disabled={qty >= product.countInStock}>
                        <FiPlus size={14} />
                     </button>
                  </div>

                  {/* دکمه افزودن */}
                  <button className="bar-add-btn" onClick={addToCartHandler}>
                     <FiShoppingBag size={18} />
                     <span className="d-none d-sm-block">افزودن</span>
                  </button>
                </div>
             ) : (
                <button className="bar-add-btn bg-secondary" disabled>
                   ناموجود
                </button>
             )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;