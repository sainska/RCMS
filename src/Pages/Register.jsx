import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import './Register.css';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessPopup from '../components/SuccessPopup';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', formData);
      setUser(res.data.user); // Store user info in context if returned
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || '❌ Registration failed!';
      toast.error(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaPhone className="icon" />
            <input type="text" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <div className="input-group select-group">
            <FaUsers className="icon" />
            <select className="role-select" name="role" value={formData.role} onChange={handleChange} required>
              <option value="user">User</option>
              <option value="project_manager">Project Manager</option>
              <option value="construction_company">Construction Company</option>
              <option value="bank">Bank</option>
            </select>
            <span className="dropdown-icon">▼</span>
          </div>

          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>

      {showSuccess && (
        <SuccessPopup 
          message="🎉 Registration Successful!"
          onClose={() => {
            setShowSuccess(false);
            navigate('/login');
          }}
        />
      )}
    </div>
  );
};

export default Register;
