import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { id } = useParams();
  const loggedInUserId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  if (userType !== 'customer' || id.trim() !== loggedInUserId?.trim()) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div style={styles.container}>
      <h2>Welcome Customer {id}</h2>
      <p>This is your personalized dashboard.</p>

      <Link to="/delivery-request" style={styles.linkButton}>
        Create Delivery Request
      </Link>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#e6f2ff',
    borderRadius: '8px',
    margin: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  linkButton: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};

export default CustomerDashboard;
