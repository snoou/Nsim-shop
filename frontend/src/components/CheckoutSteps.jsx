import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMapPin, FiCreditCard, FiCheckCircle, FiCheck } from 'react-icons/fi';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  
  // تعریف مراحل به صورت آرایه برای مدیریت تمیزتر
  const steps = [
    { 
      label: 'ورود به حساب', 
      link: '/login', 
      active: step1, 
      icon: <FiUser />,
      isCompleted: step1 && step2 // اگر مرحله 2 فعاله، یعنی مرحله 1 تموم شده
    },
    { 
      label: 'اطلاعات ارسال', 
      link: '/shipping', 
      active: step2, 
      icon: <FiMapPin />,
      isCompleted: step2 && step3 
    },
    { 
      label: 'پرداخت', 
      link: '/payment', 
      active: step3, 
      icon: <FiCreditCard />,
      isCompleted: step3 && step4 
    },
    { 
      label: 'تایید نهایی', 
      link: '/placeorder', 
      active: step4, 
      icon: <FiCheckCircle />,
      isCompleted: false // مرحله آخر تکمیل شدنش بعد از ثبت سفارشه
    },
  ];

  return (
    <div className="checkout-progress-container mb-5">
      <ul className="progressbar">
        {steps.map((step, index) => (
          <li 
            key={index} 
            className={`
              ${step.active ? 'active' : ''} 
              ${step.isCompleted ? 'completed' : ''}
            `}
          >
            {step.active ? (
              <Link to={step.link} className="step-link">
                <div className="icon-box">
                  {/* اگر مرحله تموم شده تیک نشون بده، وگرنه آیکون خود مرحله */}
                  {step.isCompleted ? <FiCheck size={20} /> : step.icon}
                </div>
                <span className="step-label">{step.label}</span>
              </Link>
            ) : (
              <div className="step-link disabled">
                <div className="icon-box">
                  {step.icon}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckoutSteps;