import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiArrowRight } from 'react-icons/fi';
import '../assets/styles/AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        
        <div className="denied-icon-wrapper">
          <FiLock size={36} />
        </div>

        <h2 className="denied-title">دسترسی محدود</h2>
        
        <p className="denied-desc">
          شما اجازه دسترسی به این بخش را ندارید. این صفحه مخصوص مدیران فروشگاه نسیم است.
          <br />
          اگر فکر می‌کنید اشتباهی رخ داده، با پشتیبانی تماس بگیرید.
        </p>

        <Link to="/" className="denied-home-btn">
          <span>بازگشت به فروشگاه</span>
          <FiArrowRight size={18} />
        </Link>

      </div>
    </div>
  );
};

export default AccessDenied;