import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import './CustomerDashboard.css';
import createImg from '/images/empty.jpg';
import historyImg from '/images/empty.jpg';
import profileImg from '/images/empty.jpg';

const CustomerDashboard = () => {
  const { id } = useParams();
  const loggedInUserId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const name = localStorage.getItem('name');

  if (userType !== 'customer' || id.trim() !== loggedInUserId?.trim()) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="wrapper">
      <div className="container">
        <h2 className="heading">👋 Welcome, {name}</h2>
        <p className="subtext">Manage your deliveries and profile from here.</p>

        {/* ─── Main Dashboard Cards ─── */}
        <div className="grid">
          <Link to="/delivery-request" className="card-hover">
            <img src={createImg} alt="Create Delivery" />
            <h3>🚚 Create Delivery</h3>
            <p>Start a new delivery request quickly and easily.</p>
          </Link>

          <Link to={`/customer-dashboard/${id}/history`} className="card-hover">
            <img src={historyImg} alt="Delivery History" />
            <h3>📦 Delivery History</h3>
            <p>Track and view all your past deliveries.</p>
          </Link>

          <Link to={`/customer-profile/${id}`} className="card-hover">
            <img src={profileImg} alt="My Profile" />
            <h3>👤 My Profile</h3>
            <p>View and update your personal information.</p>
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="service-section">
          <h2 className="section-title">🛎 Customer Services</h2>

          <div className="service-grid">
            <div className="service-card">
              <h4 className="service-title">Help & Support</h4>
              <p className="service-text">Need help? Reach out to our 24 × 7 support team.</p>
            </div>

            <div className="service-card">
              <h4 className="service-title">Raise a Complaint</h4>
              <p className="service-text">Have an issue with a delivery? Let us know.</p>
            </div>

            <div className="service-card">
              <h4 className="service-title">Service Status</h4>
              <p className="service-text">Check delivery‑system updates or outages.</p>
            </div>

            <div className="service-card">
              <h4 className="service-title">FAQs</h4>
              <p className="service-text">Find answers to common customer questions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
