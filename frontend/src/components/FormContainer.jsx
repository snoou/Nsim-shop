import React from 'react';
import logoFor from './../assets/logoFor.png';
import '../assets/styles/FormContainer.css';

const FormContainer = ({ children, title = "خوش آمدید", subtitle = "به دنیای مد و زیبایی بپیوندید" }) => {
  return (
    <div className="luxury-auth-wrapper">
      
      <div className="auth-image-section">
        <img 
          src={logoFor}
          alt="نسیم - مد و زیبایی" 
          className="auth-side-image"
        />
        <div className="auth-image-overlay">
          <div className="auth-brand-content">
            <h1 className="auth-brand-title">NSIM</h1>
            <p className="auth-brand-subtitle">استایل شما، امضای شماست.</p>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">{title}</h2>
            <span className="auth-subtitle">{subtitle}</span>
          </div>
          
          <div className="auth-form-body">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
};

export default FormContainer;