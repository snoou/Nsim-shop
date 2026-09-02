import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../assets/styles/Rating.css'; 

const Rating = ({ value = 0, text, color = '#F59E0B' }) => {
  return (
    <div className="premium-rating">
      
      <div className="stars-wrapper">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index} style={{ color }} className="star-icon">
            {value >= index ? (
              <FaStar />
            ) : value >= index - 0.5 ? (
              <FaStarHalfAlt />
            ) : (
              <FaRegStar />
            )}
          </span>
        ))}
      </div>
      
      {text && <span className="rating-text">{text}</span>}
      
    </div>
  );
};

export default Rating;