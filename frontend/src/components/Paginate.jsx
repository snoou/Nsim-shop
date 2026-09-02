import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../assets/styles/Paginate.css'; 

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (pages <= 1) return null;

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
        
        {page > 1 && (
          <Link to={getUrl(page - 1)} className="pagination-arrow" title="صفحه قبل">
            <FiChevronRight size={20} /> 
          </Link>
        )}

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

        {page < pages && (
          <Link to={getUrl(page + 1)} className="pagination-arrow" title="صفحه بعد">
            <FiChevronLeft size={20} /> 
          </Link>
        )}

      </div>
      
      <div className="pagination-info">
        صفحه {page} از {pages}
      </div>
    </div>
  );
};

export default Paginate;