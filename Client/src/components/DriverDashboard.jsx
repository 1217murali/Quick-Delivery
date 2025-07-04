import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DriverDashboard = () => {
  const { id: driverId } = useParams();
  const [requests, setRequests] = useState({});
  const [filter, setFilter] = useState('Pending');

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/driver-dashboard/${driverId}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [driverId]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/delivery-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, driverId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchRequests();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const renderRequests = () => {
    const deliveryList = requests[filter.toLowerCase()] || [];

    return deliveryList.length === 0 ? (
      <p style={styles.noData}>No {filter.toLowerCase()} deliveries.</p>
    ) : (
      <div style={styles.cardsContainer}>
        {deliveryList.map((req) => (
          <div key={req._id} style={styles.card}>
            <p><strong>Pickup:</strong> {req.pickupAddress}</p>
            <p><strong>Dropoff:</strong> {req.dropoffAddress}</p>
            <p><strong>Weight:</strong> {req.packageWeight} kg</p>
            <p><strong>Distance:</strong> {req.distance} km</p>
            <p><strong>Note:</strong> {req.note}</p>

            {filter === 'Pending' && (
              <button style={styles.button} onClick={() => updateStatus(req._id, 'Accepted')}>Accept</button>
            )}
            {filter === 'Accepted' && (
              <button style={styles.button} onClick={() => updateStatus(req._id, 'Ongoing')}>Start Delivery</button>
            )}
            {filter === 'Ongoing' && (
              <button style={styles.button} onClick={() => updateStatus(req._id, 'Completed')}>Mark as Completed</button>
            )}
            {filter === 'Completed' && req.feedback && (
              <p style={styles.feedback}><strong>Feedback:</strong> {req.feedback}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={{ marginBottom: '16px' }}>Welcome Driver {localStorage.getItem('name')}</h2>

      <div style={styles.tabRow}>
        {['Pending', 'Accepted', 'Ongoing', 'Completed'].map((label) => (
          <div
            key={label}
            style={filter === label
              ? { ...styles.tab, ...styles.activeTab }
              : styles.inactiveTab}
            onClick={() => setFilter(label)}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Active container (tab + content) with dynamic border */}
      <div style={styles.activeContainer}>
        <div style={styles.tabAndContentBorder}>
          <div style={styles.tabContentBox}>
            {renderRequests()}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  tabRow: {
    display: 'flex',
    marginBottom: '-2px', // pulls tabs to sit on top of border box
    gap: '10px',
  },
  inactiveTab: {
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    // backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  tab: {
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    position: 'relative',
    zIndex: 2,
  },
  activeTab: {
    border: '2px solid white',
    borderBottom: 'none',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    backgroundColor: '#F0F5F7',
  },
  activeContainer: {
    border: '2px solid white',
    borderRadius: '10px 10px 10px 10px',
    padding: '16px',
    marginTop: '0',
    backgroundColor: '#f9f9f9',
    zIndex: 1,
  },
  tabAndContentBorder: {
    marginTop: '-10px',
  },
  tabContentBox: {
    backgroundColor: '#f9f9f9',
  },
  cardsContainer: {
  padding : '10px',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  backgroundColor: '#f9f9f9',
  },

  card: {
  width : '90%',
  border: '1px solid #ddd',
  boxShadow: '8px 8px 8px 8px rgba(0, 0, 0, 0.1)', 
  borderRadius: '12px',                   
  padding: '30px',
  backgroundColor: '#ffffff',             
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  button: {
    marginTop: '10px',
    padding: '6px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  feedback: {
    marginTop: '10px',
    backgroundColor: '#e8f5e9',
    padding: '8px',
    borderRadius: '6px',
    color: '#2e7d32',
  },
  noData: {
    fontStyle: 'italic',
    color: '#888',
  },
};

export default DriverDashboard;
