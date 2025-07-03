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
    return (
      <div style={styles.wrapper}>
        <p style={{ fontSize: '18px', color: '#333' }}>Loading delivery history...</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📦 Delivery History for Customer {localStorage.getItem('name')}</h2>

        <Link
          to={`/customer-dashboard/${id}`}
          style={styles.backLink}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#e0f2fe')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f9ff')}
        >
          ← Back to Dashboard
        </Link>

        {deliveries.length === 0 ? (
          <p style={styles.empty}>No delivery history found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Pickup Address</th>
                  <th style={styles.th}>Dropoff Address</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Driver Name</th>
                  <th style={styles.th}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery, index) => (
                  <React.Fragment key={index}>
                    <tr style={index % 2 === 0 ? styles.stripedRow : null}>
                      <td style={styles.td}>{delivery.pickupAddress}</td>
                      <td style={styles.td}>{delivery.dropoffAddress}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: delivery.status === 'Completed' ? '#065f46' : '#92400e',
                            backgroundColor: delivery.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                          }}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td style={styles.td}>{delivery.driverName || 'Not Assigned'}</td>
                      <td style={styles.td}>{new Date(delivery.createdAt).toLocaleString()}</td>
                    </tr>

                    {delivery.status === 'Completed' && (
                      <tr>
                        <td colSpan="5" style={{ padding: '10px 20px' }}>
                          {delivery.feedback ? (
                            <p style={{ color: '#065f46', fontStyle: 'italic' }}>
                              <strong>Feedback:</strong> {delivery.feedback}
                            </p>
                          ) : (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const feedbackText =
                                  e.target.elements[`feedback-${delivery._id}`].value;
                                try {
                                  const response = await fetch(
                                    `http://localhost:5000/api/deliveries/${delivery._id}/feedback`,
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({ feedback: feedbackText }),
                                    }
                                  );
                                  if (!response.ok) throw new Error('Failed to submit feedback');

                                  // Update local state with submitted feedback
                                  setDeliveries((prev) =>
                                    prev.map((d) =>
                                      d._id === delivery._id
                                        ? { ...d, feedback: feedbackText }
                                        : d
                                    )
                                  );
                                } catch (error) {
                                  console.error('Error submitting feedback:', error);
                                  alert('Error submitting feedback');
                                }
                              }}
                            >
                              <textarea
                                name={`feedback-${delivery._id}`}
                                placeholder="Write your feedback here..."
                                rows="3"
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: '1px solid #ccc',
                                  resize: 'none',
                                }}
                                required
                              />
                              <button
                                type="submit"
                                style={{
                                  marginTop: '10px',
                                  padding: '6px 12px',
                                  border: 'none',
                                  borderRadius: '6px',
                                  backgroundColor: '#2563eb',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                }}
                              >
                                Submit Feedback
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #f0f9ff, #e0f2fe)',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '30px 40px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '24px',
    color: '#1f2937',
    marginBottom: '20px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    textDecoration: 'none',
    color: '#2563eb',
    fontWeight: 'bold',
    padding: '6px 12px',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    backgroundColor: '#f0f9ff',
    transition: '0.3s',
  },
  empty: {
    fontSize: '16px',
    color: '#6b7280',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.05)',
  },
  th: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    textAlign: 'left',
    padding: '12px',
    fontWeight: '600',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#374151',
    fontSize: '14px',
  },
  stripedRow: {
    backgroundColor: '#f9fafb',
  },
};

export default CustomerDeliveryHistory;
