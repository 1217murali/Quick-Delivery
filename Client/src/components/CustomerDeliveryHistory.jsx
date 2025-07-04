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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        console.error('Error fetching delivery history:', error);
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHistory();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <p style={styles.loadingText}>Loading delivery history...</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          📦 Delivery History for Customer {localStorage.getItem('name')}
        </h2>

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
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Pickup', 'Dropoff', 'Status', 'Driver', 'Timestamp'].map((th) => (
                    <th key={th} style={styles.th}>{th} Address</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d, i) => (
                  <React.Fragment key={d._id}>
                    <tr style={i % 2 === 0 ? styles.stripedRow : styles.row}>
                      <td style={styles.td}>{d.pickupAddress}</td>
                      <td style={styles.td}>{d.dropoffAddress}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(d.status === 'Completed'
                            ? styles.completedBadge
                            : styles.inProgressBadge),
                        }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={styles.td}>{d.driverName ?? 'Not Assigned'}</td>
                      <td style={styles.td}>
                        {new Date(d.createdAt).toLocaleString()}
                      </td>
                    </tr>

                    {d.status === 'Completed' && (
                      <tr>
                        <td colSpan="5" style={styles.feedbackTd}>
                          {d.feedback ? (
                            <p style={styles.feedbackText}>
                              <strong>Feedback:</strong> {d.feedback}
                            </p>
                          ) : (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const feedbackText =
                                  e.target.elements[`feedback-${d._id}`].value;
                                try {
                                  const res = await fetch(
                                    `http://localhost:5000/api/deliveries/${d._id}/feedback`,
                                    {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ feedback: feedbackText }),
                                    }
                                  );
                                  if (!res.ok) throw new Error('Failed to submit feedback');
                                  setDeliveries((prev) =>
                                    prev.map((x) =>
                                      x._id === d._id ? { ...x, feedback: feedbackText } : x
                                    )
                                  );
                                } catch (err) {
                                  console.error(err);
                                  alert('Error submitting feedback');
                                }
                              }}
                              style={styles.feedbackForm}
                            >
                              <textarea
                                name={`feedback-${d._id}`}
                                placeholder="Write your feedback..."
                                style={styles.textarea}
                                required
                              />
                              <button type="submit" style={styles.submitButton}>
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
    background: '#f0f9ff',
    padding: '50px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#374151',
  },
  loadingText: {
    fontSize: '18px',
    color: '#374151',
    textAlign: 'center',
    marginTop: '100px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#1f2937',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    textDecoration: 'none',
    color: '#1e40af',
    fontWeight: 600,
    padding: '8px 16px',
    border: '2px solid #1e40af',
    borderRadius: '8px',
    background: '#f0f9ff',
    transition: '0.3s',
  },
  empty: {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
    margin: '40px 0',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  },
  th: {
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 600,
    padding: '12px 16px',
    background: '#f3f4f6',
    color: '#111827',
  },
  row: {
    background: '#fff',
  },
  stripedRow: {
    background: '#f9fafb',
  },
  td: {
    padding: '12px 16px',
    verticalAlign: 'top',
    fontSize: '15px',
    color: '#374151',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
    display: 'inline-block',
  },
  completedBadge: {
    color: '#065f46',
    background: '#d1fae5',
  },
  inProgressBadge: {
    color: '#92400e',
    background: '#fef3c7',
  },
  feedbackTd: {
    padding: '16px',
    background: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
  },
  feedbackText: {
    color: '#065f46',
    fontStyle: 'italic',
    margin: 0,
  },
  feedbackForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  submitButton: {
    alignSelf: 'flex-end',
    padding: '8px 16px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default CustomerDeliveryHistory;
