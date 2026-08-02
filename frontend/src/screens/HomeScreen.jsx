import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowRight, FiGrid, FiStar } from 'react-icons/fi';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import '../assets/styles/HomeScreen.css'; // اتصال به فایل استایل جداگانه

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="luxury-home-wrapper">
      <Meta />

      {/* بخش هیرو / اسلایدر (فقط در صفحه اصلی نمایش داده می‌شود) */}
      {!keyword ? (
        <div className="hero-section">
          <ProductCarousel />
        </div>
      ) : (
        <div className="search-header-container">
          <Link to='/' className="btn-back-home">
             <FiArrowRight size={18} />
             <span>بازگشت به ویترین</span>
          </Link>
        </div>
      )}

      <div className="main-content-container">
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            {/* هدر بخش محصولات */}
            <div className="section-header-modern">
              <h1 className="section-title">
                {keyword ? (
                  <>نتایج جستجو برای: <span className="highlight-text">"{keyword}"</span></>
                ) : (
                  <><FiStar className="title-icon" /> جدیدترین کالکشن</>
                )}
              </h1>
              
              {!keyword && (
                 <div className="product-count-badge">
                    <FiGrid size={16} />
                    <span>{data.products.length} کالا</span>
                 </div>
              )}
            </div>

            {/* گرید محصولات (بدون بوت‌استرپ و کاملاً واکنش‌گرا) */}
            <div className="luxury-product-grid">
              {data.products.map((product) => (
                <div key={product._id} className="grid-item">
                  <Product product={product} />
                </div>
              ))}
            </div>

            {/* صفحه‌بندی */}
            <div className="pagination-container">
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;