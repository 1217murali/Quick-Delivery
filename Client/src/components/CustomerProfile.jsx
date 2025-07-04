import React from 'react';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const name = localStorage.getItem('name') || 'Customer Name';
  const email = localStorage.getItem('email') || 'customer@example.com';

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
            className="profile-avatar"
          />
          <h2>{name}</h2>
          <p>{email}</p>
          <button className="edit-btn">Edit Profile</button>
        </div>

        <div className="profile-details">
          <div className="detail-card">
            <h3>📦 Past Orders</h3>
            <p>23 completed deliveries</p>
          </div>

          <div className="detail-card">
            <h3>🚚 Active Deliveries</h3>
            <p>2 deliveries in progress</p>
          </div>

          <div className="detail-card support-card">
            <h3>🛠 Need Help?</h3>
            <p>Contact our support team for any queries.</p>
            <button className="support-btn">Chat with Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;