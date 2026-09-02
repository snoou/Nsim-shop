import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useFetchCategoriesQuery } from '../slices/categoryApiSlice'; 
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CategoryScreen = () => {
  const { category: categorySlug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  const { data, isLoading, error } = useGetProductsQuery({
    category: categorySlug,
  });

  const { data: categories } = useFetchCategoriesQuery();
  
  const currentCategory = categories?.find(c => c.slug === categorySlug);
  const displayCategoryName = currentCategory ? currentCategory.name : categorySlug;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>محصولات دسته‌بندی: {displayCategoryName}</h1>
      
      <Link to="/" style={{ display: 'inline-block', margin: '20px 0', padding: '10px 20px', background: '#9A79A6', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>
        بازگشت به خانه
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : !data || data.products.length === 0 ? (
        <div style={{ 
            background: '#f8f9fa', 
            padding: '50px 20px', 
            color: '#6c757d', 
            borderRadius: '8px', 
            marginTop: '20px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6' 
          }}>
          <h3 style={{ marginBottom: '15px', color: '#495057' }}>محصولی یافت نشد!</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            در حال حاضر هیچ محصولی در دسته‌بندی <b>«{displayCategoryName}»</b> موجود نیست. 
            <br />
            لطفاً بعداً دوباره سر بزنید یا از سایر بخش‌های فروشگاه دیدن کنید.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
          {data.products.map((product) => (
            <div key={product._id}>
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryScreen;