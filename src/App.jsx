import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from "./components/layout/About";

import Home from './pages/Home';
import EmployerDashboard from './components/Employer/EmployerDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/employer" element={<EmployerDashboard />} />
    </Routes>
  );
}