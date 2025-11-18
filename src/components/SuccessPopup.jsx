import React, { useEffect } from 'react';
import './SuccessPopup.css';

const SuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-overlay">
      <div className="success-box">
        <div className="circle">
          <div className="checkmark">&#10003;</div>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
