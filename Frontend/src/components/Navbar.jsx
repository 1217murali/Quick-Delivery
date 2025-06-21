import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userType, setUserType] = useState(localStorage.getItem('userType'));

  // Update state when location changes (e.g., after logout or route change)
  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    setUserType(null); // update state
    navigate('/signin');
  };

  const isLoggedIn = !!userType;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Quick Delivery</Link>

      <div style={styles.links}>
        {!isLoggedIn && (
          <>
            <Link to="/signin" style={styles.link}>Sign In</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link
              to={userType === 'customer' ? '/customer-dashboard' : '/driver-dashboard'}
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
