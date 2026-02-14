import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiHeart, FiShoppingBag, FiPlus } from 'react-icons/fi'; // آیکون‌های جدید
import { FaHeart } from 'react-icons/fa'; // قلب توپر برای حالت لایک شده
import { toast } from 'react-toastify';
import Rating from './Rating';
import { addToCart } from '../slices/cartSlice'; // فرض می‌کنیم این اکشن رو داری

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // استیت محلی برای لایک (بعداً باید به ریداکس وصل بشه)
  const [isLiked, setIsLiked] = useState(false);

  // هندلر افزودن به سبد خرید
  const addToCartHandler = (e) => {
    e.preventDefault(); // جلوگیری از باز شدن لینک محصول
    e.stopPropagation(); // جلوگیری از انتشار کلیک به والدین

    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
      toast.success(`${product.name} به سبد خرید اضافه شد`, {
        position: "bottom-center", // تو موبایل پایین بهتره
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
      });
      // navigate('/cart'); // اگر میخوای مستقیم بره سبد خرید اینو آنکامنت کن، ولی معمولا تو صفحه اصلی نمیرن
    }
  };

  // هندلر لایک کردن
  const likeHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // اینجا بعدا باید درخواست به بک‌اند ارسال بشه
    toast.info(isLiked ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      icon: isLiked ? "💔" : "❤️"
    });
  };

  return (
    <div className="chic-product-card">
      {/* بخش تصویر و دکمه لایک */}
      <div className="chic-image-wrapper">
        <Link to={`/product/${product._id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="chic-product-img" 
            loading="lazy" // برای سرعت بهتر در موبایل
          />
        </Link>
        
        {/* دکمه لایک (همیشه گوشه بالا سمت راست هست) */}
        <button className="chic-like-btn" onClick={likeHandler} title="علاقه‌مندی">
          {isLiked ? <FaHeart color="#c53030" /> : <FiHeart />}
        </button>

        {/* بج ناموجود */}
        {product.countInStock === 0 && (
            <span className="chic-badge sold-out">تمام شد</span>
        )}
      </div>

      {/* بخش اطلاعات و دکمه خرید */}
      <div className="chic-product-info">
        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
          {/* برند (کوچک بالای اسم) */}
          <div className="chic-brand">{product.brand || 'برند'}</div>
          {/* اسم محصول */}
          <h3 className="chic-title">{product.name}</h3>
        </Link>

        {/* ریتینگ (اختیاری، میشه حذفش کرد برای خلوتی بیشتر) */}
        <div className="mb-2" style={{fontSize: '0.8rem'}}>
           <Rating value={product.rating} text={null} /> 
        </div>

        {/* ردیف قیمت و دکمه خرید */}
        <div className="chic-footer-row">
          <div className="chic-price">
             {product.price.toLocaleString()} <span className="currency">تومان</span>
          </div>

          {/* دکمه افزودن به سبد (کوچک و مینیمال کنار قیمت) */}
          <button 
             className="chic-add-btn" 
             onClick={addToCartHandler} 
             disabled={product.countInStock === 0}
             title="افزودن به سبد"
          >
            {product.countInStock === 0 ? (
              <span style={{fontSize: '0.7rem', padding:'0 5px'}}>ناموجود</span>
            ) : (
              <FiPlus size={18} /> // آیکون بعلاوه شیک‌تره برای این حالت
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;