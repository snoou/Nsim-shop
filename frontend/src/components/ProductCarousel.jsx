import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Message from './Message';
import Loader from './Loader';
import { useGetPostersQuery } from '../slices/postersApiSlice'; 
import '../assets/styles/ProductCarousel.css'; 

const PosterCarousel = () => {
  const { data: posters, isLoading, error } = useGetPostersQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!posters || posters.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [posters]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  if (!posters || posters.length === 0) return null;

  const nextSlide = () => setCurrentIndex(currentIndex === posters.length - 1 ? 0 : currentIndex + 1);
  const prevSlide = () => setCurrentIndex(currentIndex === 0 ? posters.length - 1 : currentIndex - 1);

  return (
    <div className="full-width-slider-wrapper">
      <div className="slides-container">
        {posters.map((poster, index) => (
          <div 
            key={poster._id} 
            className={`full-width-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <Link to={poster.link || '/'} className="poster-link">
              <img 
                src={poster.image} 
                alt={poster.title || 'Poster'} 
                className="full-width-poster-image" 
              />
            </Link>
          </div>
        ))}
      </div>

      {posters.length > 1 && (
        <>
          <button className="nav-arrow arrow-left" onClick={nextSlide}>
            <FiChevronLeft size={44} />
          </button>
          <button className="nav-arrow arrow-right" onClick={prevSlide}>
            <FiChevronRight size={44} />
          </button>
        </>
      )}
    </div>
  );
};

export default PosterCarousel;