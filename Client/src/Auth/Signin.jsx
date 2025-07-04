import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('name');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('name', data.name);
        if (data.name) {
          localStorage.setItem('name', data.name);
        } else {
          console.warn('No name found in login response');
        }

        alert('Login successful!');

        if (data.userType === 'customer') {
          navigate(`/customer-dashboard/${data.userId}`);
        } else {
          navigate(`/driver-dashboard/${data.userId}`);
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
        }

        .signin-page {
          display: flex;
          height: 100vh;
        }

        .signin-left {
          flex: 1;
          background: linear-gradient(to bottom right, #e0f2f1, #fce4ec);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          text-align: center;
        }

        .signin-left h2 {
          font-size: 2rem;
          color: #37474f;
          margin-bottom: 20px;
        }

        .signin-left img {
          width: 80%;
          max-width: 300px;
          margin-top: 20px;
          border-radius: 10px;
          animation: floatUpDown 3s ease-in-out infinite;
        }

        .signin-right {
          flex: 1;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .signin-container {
          width: 100%;
          max-width: 380px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 40px 30px;
          text-align: center;
        }

        .signin-container h2 {
          margin-bottom: 24px;
          font-size: 24px;
          color: #3f51b5;
        }

        .signin-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .signin-input,
        .signin-select {
          padding: 12px 15px;
          font-size: 14px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: #fafafa;
        }

        .signin-input:focus,
        .signin-select:focus {
          outline: none;
          border-color: #3f51b5;
          box-shadow: 0 0 8px rgba(63, 81, 181, 0.2);
        }

        .signin-button {
          padding: 12px;
          font-size: 16px;
          background: linear-gradient(to right, #42a5f5, #7e57c2);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.3s;
        }

        .signin-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(63, 81, 181, 0.2);
        }

        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .signin-page {
            flex-direction: column;
          }

          .signin-left,
          .signin-right {
            flex: none;
            width: 100%;
          }

          .signin-left img {
            max-width: 220px;
          }
        }
      `}</style>

      <div className="signin-page">
        <div className="signin-left">
          <h2>"Delivering Happiness, One Package at a Time"</h2>
          <img src="/images/illustration.jpeg" alt="Delivery Illustration" />
        </div>

        <div className="signin-right">
          <div className="signin-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit} className="signin-form">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="signin-select"
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
                className="signin-input"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="signin-input"
              />

              <p style={{ fontSize: '14px', marginTop: '12px' }}>
                Don’t have an account?{' '}
                <Link
                  to="/signup"
                  style={{
                    color: '#3f51b5',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  }}
                >
                  Signup
                </Link>
              </p>

              <button type="submit" className="signin-button">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
