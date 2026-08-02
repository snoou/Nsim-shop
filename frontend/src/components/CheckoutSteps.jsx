import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMapPin, FiCreditCard, FiCheckCircle, FiCheck } from 'react-icons/fi';
import '../assets/styles/CheckoutSteps.css'; // اتصال به فایل استایل اختصاصی

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  
  // تعریف مراحل به صورت آرایه برای ساختار تمیزتر
  const steps = [
    { 
      label: 'ورود به حساب', 
      link: '/login', 
      active: step1, 
      icon: <FiUser size={18} />,
      isCompleted: Boolean(step2) // اگر مرحله بعدی فعال است، یعنی این مرحله با موفقیت رد شده
    },
    { 
      label: 'اطلاعات ارسال', 
      link: '/shipping', 
      active: step2, 
      icon: <FiMapPin size={18} />,
      isCompleted: Boolean(step3) 
    },
    { 
      label: 'پرداخت', 
      link: '/payment', 
      active: step3, 
      icon: <FiCreditCard size={18} />,
      isCompleted: Boolean(step4) 
    },
    { 
      label: 'تایید نهایی', 
      link: '/placeorder', 
      active: step4, 
      icon: <FiCheckCircle size={18} />,
      isCompleted: false 
    },
  ];

  return (
    <div className="luxury-checkout-steps">
      <div className="steps-wrapper">
        {steps.map((step, index) => {
          const isClickable = step.active || step.isCompleted;

          return (
            <React.Fragment key={index}>
              {/* خط اتصال بین مراحل */}
              {index > 0 && (
                <div className={`step-line ${step.active || step.isCompleted ? 'completed-line' : ''}`} />
              )}

              {/* بدنه هر مرحله */}
              <div className={`step-item ${step.active ? 'active' : ''} ${step.isCompleted ? 'completed' : ''}`}>
                {isClickable ? (
                  <Link to={step.link} className="step-content">
                    <div className="step-icon-box">
                      {step.isCompleted ? <FiCheck size={18} /> : step.icon}
                    </div>
                    <span className="step-text">{step.label}</span>
                  </Link>
                ) : (
                  <div className="step-content disabled">
                    <div className="step-icon-box">
                      {step.icon}
                    </div>
                    <span className="step-text">{step.label}</span>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;