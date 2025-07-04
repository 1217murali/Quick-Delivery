import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

  const inputStyle = {
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa, #e1bee7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '40px 50px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: '800px',
          minHeight: '550px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
        }}
      >
        <Link
          to={`/customer-dashboard/${customerId}`}
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          ← Back to Dashboard
        </Link>

        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
          🚚 Create Delivery Request
        </h2>

        <input
          type="text"
          placeholder="📍 Pickup Address"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="🏁 Dropoff Address"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="⚖️ Package Weight (kg)"
          value={packageWeight}
          onChange={(e) => setPackageWeight(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="📏 Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="📝 Package Note"
          value={packageNote}
          onChange={(e) => setPackageNote(e.target.value)}
          required
          style={{
            ...inputStyle,
            minHeight: '80px',
            resize: 'vertical',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#6200ea',
            color: '#fff',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#5e35b1')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#6200ea')}
        >
          🚀 Submit Request
        </button>
      </form>
    </div>
  );
};

export default DeliveryRequestForm;