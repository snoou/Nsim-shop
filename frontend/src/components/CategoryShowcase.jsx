import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchCategoriesQuery } from '../slices/categoryApiSlice';
import Loader from './Loader';
import Message from './Message';
import '../assets/styles/CategoryShowcase.css';

const CategoryShowcase = () => {
  const { data: categories, isLoading, error } = useFetchCategoriesQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  if (!categories || categories.length === 0) return null;

  return (
    <section className="modern-categories-section">
      <div className="modern-categories-header">
        <h2 className="modern-categories-title">دسته‌بندی‌های نسیم</h2>
        <div className="modern-categories-line"></div>
      </div>

      <div className="modern-categories-grid">
        {categories.map((category) => (
          <Link to={`/category/${category.slug}`} key={category._id} className="modern-category-card">
            <div className="modern-category-img-box">
              <img
                src={category.image}
                alt={category.name}
                className="modern-category-img"
              />
            </div>
            <div className="modern-category-info">
              <h3 className="modern-category-name">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;