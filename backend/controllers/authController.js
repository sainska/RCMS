const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Force reset password (admin/manual)
exports.forceResetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and newPassword are required' });
  }
  try {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Assign plain password; hashing handled by pre-save hook
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Force reset password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.register = async (req, res) => {
  const { fullName, email, password, phone, role } = req.body;

  try {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Let the User model pre-save hook handle hashing
    const newUser = new User({ fullName, email: normalizedEmail, phone, role, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Incorrect password' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const frontendBase = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    const resetUrl = `${frontendBase}/reset-password/${token}`;
    const message = `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail(user.email, 'RCMS Password Reset', message);
    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    // Assign plain password; hashing handled by pre-save hook
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
