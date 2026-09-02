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
import CategoryShowcase from '../components/CategoryShowcase';
import Hero from '../components/Hero';
import '../assets/styles/HomeScreen.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';

const HomeScreen = () => {
  const { pageNumber, keyword, category } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
  });

  const displayProducts = data?.products 
    ? (keyword || category 
        ? data.products 
        : data.products.filter((product) => product.isFeatured))
    : [];

  return (
    <div className="luxury-home-wrapper">
      <Hero />
      <Meta />

      {(keyword || category) && (
        <div className="search-header-container">
          <Link to='/' className="btn-back-home">
            <FiArrowRight size={18} />
            <span>بازگشت به ویترین</span>
          </Link>
        </div>
      )}

      <div className="main-content-container">
        <div className='bg-rela'>
          <div className='bg-bg'></div>

          <div className='content-on-top'>
            {!keyword && <CategoryShowcase />}
          </div>
        </div>

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
            <div className="section-header-modern">
              <h1 className="section-title">
                {keyword ? (
                  <>نتایج جستجو برای: <span className="highlight-text">"{keyword}"</span></>
                ) : category ? (
                  <>دسته‌بندی: <span className="highlight-text">{category}</span></>
                ) : (
                  <><FiStar className="title-icon" /> جدیدترین کالکشن</>
                )}
              </h1>

              {!keyword && !category && (
                <div className="product-count-badge">
                  <FiGrid size={16} />
                  <span>{displayProducts.length} کالا</span>
                </div>
              )}
            </div>

            <div className="custom-swiper-container" style={{ padding: '15px 0' }}>
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={4.4}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 2.2,
                    spaceBetween: 16,
                  },
                  576: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  992: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                dir="rtl"
              >
                {displayProducts.map((product) => (
                  <SwiperSlide key={product._id} style={{ height: 'auto' }}>
                    <div className="grid-item">
                      <Product product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="pagination-container">
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
              />
            </div>
          </>
        )}

        {!keyword && !category && (
          <ProductCarousel />
        )}

      </div>
    </div>
  );
};

export default HomeScreen;