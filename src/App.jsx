import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from "./pages/About";
import Home from './pages/Home';
import EmployerDashboard from './components/Employer/EmployerDashboard';
import UserProfile from './components/Employer/UserProfile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/employer" element={<EmployerDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}