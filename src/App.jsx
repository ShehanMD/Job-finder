
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import About from './pages/About';
import Home from './pages/Home';

import EmployerDashboard from './components/Employer/EmployerDashboard';
import UserProfile from './components/Employer/UserProfile';
import SeekerDashboard from './components/Seeker/SeekerDashboard';

import Chatbot from './components/Chatbot/Chatbot.jsx';

import { customBase } from './components/firebase/customBase';
import { useAuth } from './components/auth/AuthContext';

// Don't remove this
customBase.autoInit();

// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const { isLoggedIn, role, loading } = useAuth();

  // Wait until authentication and user role are loaded
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        Loading...
      </div>
    );
  }

  // Redirect logged-out users
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Check user role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Main App Component
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route
          path="/employer"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seeker"
          element={
            <ProtectedRoute allowedRole="seeker">
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Chatbot />
    </>
  );
}
