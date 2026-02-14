import React from 'react';
import { Alert } from 'react-bootstrap';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const Message = ({ variant, children }) => {
  // انتخاب آیکون و کلاس بر اساس نوع پیام
  let icon = null;
  let customClass = '';

  switch (variant) {
    case 'danger':
      icon = <FiAlertCircle size={20} />;
      customClass = 'fashion-alert-danger';
      break;
    case 'success':
      icon = <FiCheckCircle size={20} />;
      customClass = 'fashion-alert-success';
      break;
    case 'warning':
      icon = <FiAlertTriangle size={20} />;
      customClass = 'fashion-alert-warning';
      break;
    default: // info
      icon = <FiInfo size={20} />;
      customClass = 'fashion-alert-info';
  }

  return (
    <Alert 
      variant={variant} 
      className={`fashion-alert d-flex align-items-center ${customClass}`}
    >
      <span className="alert-icon-wrapper ms-2">
        {icon}
      </span>
      <span className="alert-text">
        {children}
      </span>
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;