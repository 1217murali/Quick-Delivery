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
      <p>No {filter.toLowerCase()} deliveries.</p>
    ) : (
      deliveryList.map((req) => (
        <div key={req._id} style={styles.card}>
          <p><strong>Pickup:</strong> {req.pickupAddress}</p>
          <p><strong>Dropoff:</strong> {req.dropoffAddress}</p>
          <p><strong>Weight:</strong> {req.packageWeight} kg</p>
          <p><strong>Distance:</strong> {req.distance} km</p>
          <p><strong>Note:</strong> {req.note}</p>

          {filter === 'Pending' && (
            <>
              <button onClick={() => updateStatus(req._id, 'Accepted')}>Accept</button>{' '}
              {/* <button onClick={() => updateStatus(req._id, 'Rejected')}>Reject</button> */}
            </>
          )}

          {filter === 'Accepted' && (
            <button onClick={() => updateStatus(req._id, 'Ongoing')}>Start Delivery</button>
          )}

          {filter === 'Ongoing' && (
            <button onClick={() => updateStatus(req._id, 'Completed')}>Mark as Completed</button>
          )}
        </div>
      ))
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome Driver {localStorage.getItem('name')}</h2>

      <div style={styles.filterButtons}>
        <button onClick={() => setFilter('Pending')}>Pending</button>{' '}
        <button onClick={() => setFilter('Accepted')}>Accepted</button>{' '}
        <button onClick={() => setFilter('Ongoing')}>Ongoing</button>{' '}
        <button onClick={() => setFilter('Completed')}>Completed</button>{' '}
        {/* <button onClick={() => setFilter('Rejected')}>Rejected</button> */}
      </div>

      {renderRequests()}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '12px',
    backgroundColor: '#f9f9f9',
  },
  filterButtons: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px'
  }
};

export default DriverDashboard;
