import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from "./pages/About";
import Home from './pages/Home';
import EmployerDashboard from './components/Employer/EmployerDashboard';
import UserProfile from './components/Employer/UserProfile'
import { useState } from "react";
import { customBase } from "./components/firebase/customBase"


export default function App() {
  const [role, setRole] = useState(null);
  const [employerType, setEmployerType] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSeekerSelect = () => {
    setRole('seeker');
    setEmployerType(null);
    setStep(2);
  };

  const handleEmployerTypeSelect = (type) => {
    setEmployerType(type);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
      setRole(null);
      setEmployerType(null);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();



    await register(formData.email, formData.password);



    //console.log("Submitted Data:", { role, employerType, ...formData });
    //alert("Registration Completed Successfully!");
  };


  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      const { password: _password, confirmPassword: _confirmPassword, ...safeFormData } = formData;


      await set(ref(db, `USER/${user.uid}`), { ...safeFormData, uid: user.uid, createdAt: Date.now(), employerType: employerType, role: role });

      alert("Registration Completed Successfully!");

    } catch (error) {
      console.error("Registration error:", error.code, error.message);
    }
  };


  customBase.autoInit();  // dont remowe this




  (async () => {


    const data2 = await customBase.db.push('ADM', { name: "hellow" })   
    console.log("put : ", data2);                                               /// example for data add

    const data = await customBase.db.get("ADM")
    console.log("retrew : ", data);                                         /// example for data read




  })();


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/employer" element={<EmployerDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}