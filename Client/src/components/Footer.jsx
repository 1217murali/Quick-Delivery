import React from 'react';

function Footer() {
  const styles = {
    footer: {
      width: '100%',
      background: '#0d47a1',
      color: '#fff',
      padding: '20px 20px',
      textAlign: 'center',
      
    },
    heading: {
      color: '#90caf9',
      marginBottom: '10px'
    },
    link: {
      color: '#fce4ec',
      textDecoration: 'none',
      margin: '0 10px'
    },
    linkHover: {
      textDecoration: 'underline',
      color: '#bbdefb'
    },
    contact: {
      marginTop: '10px'
    }
  };

  return (
    <footer style={styles.footer}>
      <div className="footer-content">
        <h3 style={styles.heading}>Quick Delivery</h3>
        <p>Email: quickdeliverylite@gmail.com</p>
        <p>Contact: +91 xxxxxxxxx</p>
        <div>
          <a
            href="#"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Facebook
          </a>
          |
          <a
            href="#"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Twitter
          </a>
          |
          <a
            href="#"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Instagram
          </a>
        </div>
        <p style={styles.contact}>
          &copy; {new Date().getFullYear()} Quick Delivery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
