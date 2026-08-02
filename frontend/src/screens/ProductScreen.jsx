import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiUser, FiCalendar, FiCheck, FiX } from 'react-icons/fi';

import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import '../assets/styles/ProductScreen.css'; 

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // استیت برای مدیریت عکسی که در حال نمایش است
  const [activeImage, setActiveImage] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  // تنظیم اولین عکس به عنوان عکس پیش‌فرض هنگام لود شدن محصول
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

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
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success('نظر شما با موفقیت ثبت شد');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  // استخراج لیست تصاویر (اگر آرایه تصاویر وجود داشت از آن استفاده میکنیم، وگرنه فقط عکس اصلی)
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="editorial-product-wrapper">
      <Meta title={product.name} image={product.image} />

      <div className="editorial-container">
        
        {/* دکمه بازگشت مینیمال */}
        <div className="back-nav">
          <Link to="/" className="btn-minimal-back">
            <FiArrowRight size={20} /> بازگشت به ویترین
          </Link>
        </div>

        <div className="product-split-layout">
          
          {/* --- ستون راست: گالری تصاویر ادیتوریال --- */}
          <div className="gallery-section">
            <div className="main-image-display">
              <img src={activeImage} alt={product.name} />
            </div>
            
            {/* نمایش لیست تصاویر کوچک در صورتی که بیشتر از یک عکس باشد */}
            {productImages.length > 1 && (
              <div className="thumbnail-track">
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumb-item ${activeImage === img ? 'active-thumb' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${product.name} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- ستون چپ: اطلاعات و خرید --- */}
          <div className="details-section">
            
            <div className="product-header-block">
              <span className="brand-label">{product.brand || 'نسیم کالکشن'}</span>
              <h1 className="main-title">{product.name}</h1>
              
              <div className="meta-info">
                <div className="rating-wrap">
                  <Rating value={product.rating} />
                  <span className="review-count text-muted">({product.numReviews} دیدگاه)</span>
                </div>
                <div className={`stock-status ${product.countInStock > 0 ? 'text-teal' : 'text-danger'}`}>
                  {product.countInStock > 0 ? <><FiCheck /> آماده ارسال</> : <><FiX /> ناموجود</>}
                </div>
              </div>
            </div>

            <div className="price-block">
              <span className="price-number">{Number(product.price).toLocaleString()}</span>
              <span className="currency-text">تومان</span>
            </div>

            <p className="description-text">{product.description}</p>

            {/* کنترلرهای خرید */}
            <div className="purchase-action-container">
              {product.countInStock > 0 ? (
                <div className="action-row">
                  <div className="qty-pill">
                     <button onClick={decreaseQty} disabled={qty <= 1}><FiMinus /></button>
                     <span className="qty-val">{qty}</span>
                     <button onClick={increaseQty} disabled={qty >= product.countInStock}><FiPlus /></button>
                  </div>
                  <button className="btn-add-to-bag" onClick={addToCartHandler}>
                     <FiShoppingBag size={20} />
                     <span>افزودن به سبد خرید</span>
                  </button>
                </div>
              ) : (
                <button className="btn-add-to-bag out-of-stock-btn" disabled>
                   در حال حاضر ناموجود است
                </button>
              )}
            </div>

            {/* خط جداکننده محو */}
            <div className="soft-divider"></div>

            {/* بخش نظرات */}
            <div className="product-reviews-block">
              <h3 className="block-title">نظرات خریداران</h3>
              
              <div className="reviews-list">
                {product.reviews.length === 0 && <p className="text-muted">هنوز نظری ثبت نشده است.</p>}
                {product.reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-head">
                        <div className="reviewer">
                            <div className="avatar"><FiUser size={14} /></div>
                            <span className="name">{review.name}</span>
                        </div>
                        <Rating value={review.rating} />
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <span className="review-date">{review.createdAt.substring(0, 10)}</span>
                  </div>
                ))}
              </div>
              
              {/* فرم ثبت نظر */}
              <div className="review-form-box">
                <h4 className="form-title">ثبت دیدگاه جدید</h4>
                {loadingProductReview && <Loader />}
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="form-group">
                      <select className="minimal-input" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                        <option value="">امتیاز شما...</option>
                        <option value="5">عالی (۵ ستاره)</option>
                        <option value="4">خوب (۴ ستاره)</option>
                        <option value="3">متوسط (۳ ستاره)</option>
                        <option value="2">ضعیف (۲ ستاره)</option>
                        <option value="1">خیلی بد (۱ ستاره)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <textarea className="minimal-input" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="نظرتان را بنویسید..." required></textarea>
                    </div>
                    <button disabled={loadingProductReview} type="submit" className="btn-submit-minimal">
                      ارسال دیدگاه
                    </button>
                  </form>
                ) : (
                  <div className="login-alert">
                    برای ثبت نظر <Link to="/login">وارد شوید</Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;