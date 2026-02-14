import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiLock, FiArrowRight } from 'react-icons/fi'; // آیکون قفل و فلش

const AccessDenied = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '60vh' }}>
      
      {/* آیکون قفل بزرگ و متحرک */}
      <div className="denied-icon-wrapper mb-4">
        <FiLock size={50} />
      </div>

      <h2 className="mb-3 fw-bold text-dark">دسترسی محدود</h2>
      
      <p className="text-muted mb-5" style={{ maxWidth: '400px', lineHeight: '1.8' }}>
        شما اجازه دسترسی به این بخش را ندارید. این صفحه مخصوص مدیران فروشگاه است.
        <br />
        اگر فکر می‌کنید اشتباهی رخ داده، با پشتیبانی تماس بگیرید.
      </p>

      <Link to="/">
        <Button variant="dark" className="px-5 py-2 rounded-pill d-flex align-items-center gap-2">
          بازگشت به فروشگاه <FiArrowRight />
        </Button>
      </Link>

    </Container>
  );
};

export default AccessDenied;