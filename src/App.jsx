import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import EmployerDashboard from './components/Employer/EmployerDashboard';

  export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/employer" element={<EmployerDashboard />} />
    </Routes>
  );
}