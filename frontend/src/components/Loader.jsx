import React from 'react';
import '../assets/styles/Loader.css'; 

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="modern-spinner"></div>
      <span className="loading-text">در حال بارگذاری...</span>
    </div>
  );
};

export default Loader;