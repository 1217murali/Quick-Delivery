import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userType'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (location.pathname === '/signin') {
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    }

    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');

    setIsLoggedIn(!!storedUserType);
    setUserType(storedUserType);
    setUserId(storedUserId);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserType(null);
    setUserId(null);
    navigate('/signin');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Quick Delivery</Link>

      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            <Link to="/signin" style={styles.link}>Sign In</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        ) : (
          <>
            <Link
              to={
                userType === 'customer'
                  ? `/customer-dashboard/${userId}`
                  : `/driver-dashboard/${userId}`
              }
              style={styles.link}
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    alignItems: 'center',
  },
  logo: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: 'white',
    fontSize: '20px',
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
