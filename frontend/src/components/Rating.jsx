import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color }) => {
  return (
    <div className='fashion-rating'>
      {/* تولید هوشمند ستاره‌ها */}
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
      
      {/* متن تعداد نظرات (اختیاری) */}
      {text && <span className='rating-text'>{text}</span>}
    </div>
  );
};

// رنگ پیش‌فرض: طلایی برند (#c5a065) به جای زرد جیغ
Rating.defaultProps = {
  color: '#c5a065', 
  value: 0,
};

export default Rating;