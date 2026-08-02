import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Message from './Message';
import Loader from './Loader';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import '../assets/styles/ProductCarousel.css';
import Mana from '../assets/mana.png'

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [products]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  if (!products || products.length === 0) return null;

  const nextSlide = () => setCurrentIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
  const prevSlide = () => setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);

  return (
    <div className="luxury-slider-wrapper">
      
      {/* 🔴 پترن هندسی محو در مرکز پس‌زمینه */}
      <div className="geometric-pattern-bg"></div>

      {/* 🔴 آواتار ثابت در سمت راست (مثل عکس خودت) */}
      <div className="avatar-right-container">
        {/* یک عکس PNG از کاراکتر که به سمت چپ (مرکز) اشاره می‌کند اینجا بگذار */}
        <img 
          src={Mana}
          alt="نسیم" 
          className="avatar-image" 
        />
      </div>

      {/* 🟢 بخش متحرک (متن در چپ، محصول در مرکز) */}
      <div className="slides-container">
        {products.map((product, index) => (
          <div key={product._id} className={`luxury-slide ${index === currentIndex ? 'active' : ''}`}>
            
            {/* سمت چپ: متن و دکمه */}
            <div className="slide-text-left">
              <h2 className="slide-title">{product.name}</h2>
              <p className="slide-subtitle">
                {product.description ? product.description.substring(0, 80) + '...' : 'بهترین کیفیت برای شما'}
              </p>
              
              <Link to={`/product/${product._id}`} className="slide-btn-teal">
                مشاهده محصول
              </Link>
            </div>

            {/* مرکز: عکس محصول */}
            <div className="slide-product-center">
              {/* با قابلیت mix-blend-mode پس‌زمینه سفید عکس‌ها محو می‌شود */}
              <img src={product.image} alt={product.name} className="product-image-blend" />
            </div>

          </div>
        ))}
      </div>

      {/* فلش‌های ناوبری مینیمال در دو طرف */}
      <button className="nav-arrow arrow-left" onClick={nextSlide}>
        <FiChevronLeft size={44} />
      </button>
      <button className="nav-arrow arrow-right" onClick={prevSlide}>
        <FiChevronRight size={44} />
      </button>

    </div>
  );
};

export default ProductCarousel;