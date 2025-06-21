import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { id } = useParams();
  const loggedInUserId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  // Debug logs
  // console.log("Param ID:", id);
  // console.log("Stored ID:", loggedInUserId);
  // console.log("User type:", userType);

  if (userType !== 'customer' || id.trim() !== loggedInUserId?.trim()) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div style={styles.container}>
      <h2>Welcome Customer {id}</h2>
      <p>This is your personalized dashboard.</p>
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
};

export default CustomerDashboard;
