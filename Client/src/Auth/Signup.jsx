import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; 
import img1 from '/images/img2.jpeg';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const checkEmailExists = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/check-email?email=${email}`);
      const data = await res.json();
      return data.exists;
    } catch (err) {
      console.error('Email check failed', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      alert('Email is already registered');
      return;
    }

    const newUser = { name, email, password, userType };

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      alert(data.message || 'Signup successful!');
      navigate('/signin');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-form-box">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="" disabled hidden>Select user type</option>
              <option value="customer">Customer</option>
              <option value="driver">Driver</option>
            </select>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
      <div className="signup-right">
        <div className="floating-quote">
          “Your journey to faster deliveries <br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Begins here.”
        </div>
        <div className="signup-image-overlay">
          <img
            src={img1}
            alt="Delivery person"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;