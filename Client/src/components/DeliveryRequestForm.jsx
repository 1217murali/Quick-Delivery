import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryRequestForm = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [packageNote, setPackageNote] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [distance, setDistance] = useState('');
  const customerId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/delivery-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          pickupAddress,
          dropoffAddress,
          packageNote,
          packageWeight: parseFloat(packageWeight),
          distance: parseFloat(distance),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Delivery request submitted!');
        navigate(`/customer-dashboard/${customerId}`);
      } else {
        alert(data.message || 'Failed to submit request.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Delivery Request</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Pickup Address"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dropoff Address"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Package Weight (kg)"
          value={packageWeight}
          onChange={(e) => setPackageWeight(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          required
        />
        <textarea
          placeholder="Package Note"
          value={packageNote}
          onChange={(e) => setPackageNote(e.target.value)}
          required
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default DeliveryRequestForm;
