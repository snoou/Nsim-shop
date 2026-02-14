import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // آیکون‌های ظریف

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  // اگر فقط یک صفحه داریم، اصلاً چیزی نشون نده
  if (pages <= 1) return null;

  // تابع کمکی برای ساخت لینک
  const getUrl = (p) => {
    if (isAdmin) {
      return `/admin/productlist/${p}`;
    } else {
      return keyword ? `/search/${keyword}/page/${p}` : `/page/${p}`;
    }
  };

  return (
    <div className="fashion-pagination-container">
      <div className="fashion-pagination-glass">
        
        {/* دکمه قبلی (اگر صفحه اول نیستیم) */}
        {page > 1 && (
          <Link to={getUrl(page - 1)} className="pagination-arrow" title="صفحه قبل">
            <FiChevronRight size={20} /> {/* چون RTL هستیم، رایت میشه قبل */}
          </Link>
        )}

        {/* لیست شماره‌ها */}
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

        {/* دکمه بعدی (اگر صفحه آخر نیستیم) */}
        {page < pages && (
          <Link to={getUrl(page + 1)} className="pagination-arrow" title="صفحه بعد">
            <FiChevronLeft size={20} /> {/* چون RTL هستیم، لفت میشه بعد */}
          </Link>
        )}

      </div>
      
      {/* متن راهنما زیر پیجینیشن */}
      <div className="pagination-info">
        صفحه {page} از {pages}
      </div>
    </div>
  );
};

export default Paginate;