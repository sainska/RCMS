import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import './Login.css';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessPopup from '../components/SuccessPopup';
import { API_BASE } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    if (!formData.email || !formData.password) {
      toast.error('❌ Please enter both email and password');
      return;
    }

    console.log('Form Data:', formData);
    console.log('API Base:', API_BASE);
    console.log('Login URL:', `${API_BASE}/api/auth/login`);

    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        {
          email: formData.email.trim(),
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: false
        }
      );
      
      console.log('Login response:', res.data);
      
      if (res.data && res.data.user) {
        const { user, token } = res.data;
        
        // Store token in localStorage if provided
        if (token) {
          localStorage.setItem('token', token);
        }
        
        setUser(user); // Store user info in context
        setShowSuccess(true);

        setTimeout(() => {
          if (user.role === 'user') navigate('/user-dashboard');
          else if (user.role === 'project_manager') navigate('/project-manager');
          else if (user.role === 'construction_company') navigate('/construction-company');
          else if (user.role === 'bank') navigate('/bank-management');
          else navigate('/');
        }, 2500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);

      const serverMessage = err.response?.data?.message;
      // Friendly messaging for common auth failures
      if (serverMessage && /password/i.test(serverMessage)) {
        toast.error(serverMessage + ' — try resetting your password.');
      } else if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error(err.message || '❌ Login failed. Please try again.');
      }

      // Developer/debug logs for 400-level responses
      if (err.response?.status >= 400 && err.response?.status < 500) {
        console.error(`${err.response?.status} response from ${API_BASE}/api/auth/login`);
        console.error('Request payload (masked):', { email: formData.email.trim(), password: '***' });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Login</button>

          {/* ✅ Forgot Password Link */}
          <p style={{ textAlign: 'right', marginTop: '0.5rem' }}>
            <a href="/forgot-password" style={{ color: '#006400', fontSize: '0.8rem', textDecoration: 'underline' }}>
              Forgot Password?
            </a>
          </p>
        </form>
      </div>

      {showSuccess && (
        <SuccessPopup 
          message="✅ Logged In Successfully!"
          onClose={() => {}}
        />
      )}
    </div>
  );
};

export default Login;
