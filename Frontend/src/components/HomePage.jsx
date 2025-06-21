import React, { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    // Logout logic
    localStorage.removeItem('userType');
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Quick Delivery</h1>
      <p>Please sign in or sign up to continue.</p>
    </div>
  );
};

export default HomePage;
