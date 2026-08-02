import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../assets/styles/Paginate.css'; 

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  // اگر فقط یک صفحه داریم، صفحه‌بندی نیازی نیست
  if (pages <= 1) return null;

  // ساخت داینامیک آدرس‌ها
  const getUrl = (p) => {
    if (isAdmin) {
      return `/admin/productlist/${p}`;
    } else {
      return keyword ? `/search/${keyword}/page/${p}` : `/page/${p}`;
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-wrapper">
        
        {/* دکمه قبلی (فلش راست چون سایت فارسی است) */}
        {page > 1 && (
          <Link to={getUrl(page - 1)} className="pagination-arrow" title="صفحه قبل">
            <FiChevronRight size={20} /> 
          </Link>
        )}

        {/* لیست شماره صفحات */}
        <div className="pagination-numbers">
          {[...Array(pages).keys()].map((x) => {
            const pageNumber = x + 1;
            return (
              <Link
                key={pageNumber}
                to={getUrl(pageNumber)}
                className={`pagination-item ${pageNumber === page ? 'active' : ''}`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>

        {/* دکمه بعدی (فلش چپ) */}
        {page < pages && (
          <Link to={getUrl(page + 1)} className="pagination-arrow" title="صفحه بعد">
            <FiChevronLeft size={20} /> 
          </Link>
        )}

      </div>
      
      {/* راهنمای متنی پایین */}
      <div className="pagination-info">
        صفحه {page} از {pages}
      </div>
    </div>
  );
};

export default Paginate;