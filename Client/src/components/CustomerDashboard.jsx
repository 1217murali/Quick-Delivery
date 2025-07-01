import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { id } = useParams();
  const loggedInUserId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const name = localStorage.getItem('name');

  if (userType !== 'customer' || id.trim() !== loggedInUserId?.trim()) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>👋 Welcome, {name}</h2>
        <p style={styles.subtext}>Manage your deliveries and profile from here.</p>

        <div style={styles.grid}>
          <Link to="/delivery-request" style={styles.card} className="card-hover">
            <h3 style={styles.cardTitle}>🚚 Create Delivery</h3>
            <p style={styles.cardText}>Start a new delivery request quickly and easily.</p>
          </Link>

          <Link to={`/customer-dashboard/${id}/history`} style={styles.card} className="card-hover">
            <h3 style={styles.cardTitle}>📦 Delivery History</h3>
            <p style={styles.cardText}>Track and view all your past deliveries.</p>
          </Link>

          <Link to={`/customer-profile/${id}`} style={styles.card} className="card-hover">
            <h3 style={styles.cardTitle}>👤 My Profile</h3>
            <p style={styles.cardText}>View and update your personal information.</p>
          </Link>
        </div>
      </div>

      {/* Hover effect styling */}
      <style>{`
        .card-hover:hover {
          background-color: #e0f2fe;
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(to right, #f0f9ff, #e0f7fa)',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
    maxWidth: '1000px',
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    fontSize: '28px',
    color: '#1f2937',
    marginBottom: '10px',
  },
  subtext: {
    fontSize: '16px',
    color: '#4b5563',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: '#f9fafb',
    padding: '25px 20px',
    borderRadius: '16px',
    textDecoration: 'none',
    color: '#111827',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: '0.3s ease',
  },
  cardTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#2563eb',
  },
  cardText: {
    fontSize: '14px',
    color: '#4b5563',
  },
};

export default CustomerDashboard;
