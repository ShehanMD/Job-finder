import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from "./pages/About";
import Home from './pages/Home';
import EmployerDashboard from './components/Employer/EmployerDashboard';
import UserProfile from './components/Employer/UserProfile'
import {customBase} from "./components/firebase/customBase"
import SeekerDashboard from './components/Seeker/SeekerDashboard';

import Chatbot from './components/Chatbot/Chatbot.jsx';


customBase.autoInit();  // dont remowe this




  (async () => {


    //const data2 = await customBase.db.push('ADM', { name: "hellow" })   
    //console.log("put : ", data2);                                               /// example for data add

   // const data = await customBase.db.get("ADM")
    //console.log("retrew : ", data);                                         /// example for data read




  })();



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";
import EmployerDashboard from "./components/Employer/EmployerDashboard";
import SeekerDashboard from "./components/Seeker/SeekerDashboard";
import UserProfile from "./components/Employer/UserProfile";

import { useAuth } from "./components/auth/AuthContext";

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
