import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const DriverDashboard = () => {
  const { id } = useParams();
  const loggedInUserId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  // Debug logs
  // console.log("Driver ID from URL:", id);
  // console.log("Driver ID from localStorage:", loggedInUserId);
  // console.log("User type from localStorage:", userType);

  if (userType !== 'driver' || id.trim() !== loggedInUserId?.trim()) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div style={styles.container}>
      <h2>Welcome Driver {id}</h2>
      <p>This is your personalized dashboard.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    margin: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
};

export default DriverDashboard;
