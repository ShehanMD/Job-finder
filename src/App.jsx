import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from "./pages/About";
import Home from './pages/Home';
import EmployerDashboard from './components/Employer/EmployerDashboard';
import UserProfile from './components/Employer/UserProfile'
import {customBase} from "./components/firebase/customBase"




customBase.autoInit();  // dont remowe this




  (async () => {


    const data2 = await customBase.db.push('ADM', { name: "hellow" })   
    console.log("put : ", data2);                                               /// example for data add

    const data = await customBase.db.get("ADM")
    console.log("retrew : ", data);                                         /// example for data read




  })();





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