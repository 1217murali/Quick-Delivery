import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CustomerDeliveryHistory = () => {
  const { id } = useParams();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/customers/${id}/history`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        console.error('Error fetching delivery history:', error);
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHistory();
    }
  }, [id]);

  if (loading) {
    return <p>Loading delivery history...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Delivery History for Customer {localStorage.getItem('name')}</h2>

      <Link to={`/customer-dashboard/${id}`} style={styles.backLink}>← Back to Dashboard</Link>

      {deliveries.length === 0 ? (
        <p>No delivery history found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Pickup Address</th>
              <th>Dropoff Address</th>
              <th>Status</th>
              <th>Driver Name</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery, index) => (
              <tr key={index}>
                <td>{delivery.pickupAddress}</td>
                <td>{delivery.dropoffAddress}</td>
                <td>{delivery.status}</td>
                <p>{delivery.driverName}</p>
                <td>{new Date(delivery.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    margin: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '15px',
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default CustomerDeliveryHistory;
