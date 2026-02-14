import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logoFor from './../assets/logoFor.png';


const FormContainer = ({ children, title = "خوش آمدید", subtitle = "به دنیای مد و زیبایی بپیوندید" }) => {
  return (
    <div className="auth-page-wrapper">
      {/* دایره‌های متحرک پس‌زمینه برای زیبایی بیشتر */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>

      <Container fluid className="p-0 h-100">
        <Row className="g-0 h-100">
          
          {/* ستون تصویر (در موبایل مخفی میشه) */}
          <Col lg={6} className="d-none d-lg-block p-0 position-relative overflow-hidden">
            <div className="auth-image-overlay">
              <div className="auth-image-text">
                <h1 className="display-4 fw-bold text-white mb-3" style={{fontFamily: 'Playfair Display'}}>NSIM</h1>
                <p className="lead text-white-50">استایل شما، امضای شماست.</p>
              </div>
            </div>
            {/* تصویر مدل فشن - می‌تونی لینک رو با عکس لوکال عوض کنی */}
            <img 
              src={logoFor}
              alt="Fashion Model" 
              className="auth-bg-image"
            />
          </Col>

          {/* ستون فرم */}
          <Col lg={6} className="d-flex align-items-center justify-content-center position-relative">
            <div className="auth-form-container">
              <div className="glass-card">
                <div className="text-center mb-5">
                  <h2 className="auth-title">{title}</h2>
                  <span className="auth-subtitle text-muted">{subtitle}</span>
                </div>
                
                {/* این children همون فرم‌های لاگین یا ثبت نام هستن */}
                <div className="auth-form-wrapper">
                  {children}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FormContainer;