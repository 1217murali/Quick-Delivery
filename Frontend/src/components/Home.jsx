import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Signin from '../Auth/Signin';
import Signup from '../Auth/Signup';
import CustomerDashboard from './CustomerDashboard';
import DriverDashboard from './DriverDashboard';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './HomePage'; // 🆕 import this

function Home() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/customer-dashboard/:id"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver-dashboard/:id"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />


        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
      </Routes>
    </Router>
  );
}

export default Home;
