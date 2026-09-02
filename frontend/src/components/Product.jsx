import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiHeart, FiPlus } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addToCart } from '../slices/cartSlice';
import '../assets/styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);

  const addToCartHandler = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
      
      toast.success(`${product.name} به سبد خرید اضافه شد`, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored", 
      });
    }
  };

  const likeHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    
    toast.info(isLiked ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      icon: isLiked ? "💔" : "❤️"
    });
  };

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <Link to={`/product/${product._id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="card-img" 
            loading="lazy" 
          />
        </Link>
        
        <button className="like-btn" onClick={likeHandler} aria-label="افزودن به علاقه‌مندی">
          {isLiked ? <FaHeart color="#EF4444" size={18} /> : <FiHeart size={18} />}
        </button>

        {product.countInStock === 0 && (
          <span className="stock-badge out-of-stock">ناموجود</span>
        )}
      </div>

      <div className="card-info">
        <div className="card-meta">
          <span className="card-brand">{product.brand || 'نسیم'}</span>
        </div>

        <Link to={`/product/${product._id}`} className="card-title-link">
          <h3 className="card-title">{product.name}</h3>
        </Link>

        <div className="card-footer">
          <div className="card-price">
             {product.price.toLocaleString()} <span className="currency">تومان</span>
          </div>

          <button 
             className={`add-btn ${product.countInStock === 0 ? 'disabled' : ''}`} 
             onClick={addToCartHandler} 
             disabled={product.countInStock === 0}
             title={product.countInStock === 0 ? 'ناموجود' : 'افزودن به سبد'}
          >
            {product.countInStock === 0 ? (
              <span className="disabled-text">تمام شد</span>
            ) : (
              <FiPlus size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;