import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import '../assets/styles/Message.css'

const Message = ({ variant = 'info', children }) => {
  let icon = null;

  switch (variant) {
    case 'danger':
      icon = <FiAlertCircle size={20} />;
      break;
    case 'success':
      icon = <FiCheckCircle size={20} />;
      break;
    case 'warning':
      icon = <FiAlertTriangle size={20} />;
      break;
    default: // info
      icon = <FiInfo size={20} />;
  }

  return (
    <div className={`custom-alert alert-${variant}`}>
      <span className="alert-icon">
        {icon}
      </span>
      <span className="alert-text">
        {children}
      </span>
    </div>
  );
};

export default Message;