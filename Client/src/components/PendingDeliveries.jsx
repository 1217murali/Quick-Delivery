import React, { useEffect, useState } from 'react';

const PendingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const res = await fetch('http://localhost:5000/api/deliveries/pending');
      const data = await res.json();
      setDeliveries(data.reverse()); // reverse chronological order
    };

    fetchDeliveries();
  }, []);

  return (
    <div>
      <h2>Pending Deliveries</h2>
      {deliveries.map((d, index) => (
        <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><strong>Pickup:</strong> {d.pickup}</p>
          <p><strong>Dropoff:</strong> {d.dropoff}</p>
          <p><strong>Note:</strong> {d.note}</p>
          <p><strong>Date:</strong> {new Date(d.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PendingDeliveries;
