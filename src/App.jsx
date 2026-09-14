import bgImage from './assets/bg-image.jpg';
import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RoleSelection from './components/auth/RoleSelection';
import RegisterForm from './components/auth/RegisterForm';
import ProfileCompletionForm from './components/auth/ProfileCompletionForm';

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
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", { role, employerType, ...formData });
    alert("Registration Completed Successfully!");
  };

  return (
    
    <div 
      className="min-h-screen text-white flex flex-col justify-between bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar />

        <main className="flex-1 flex flex-col justify-center items-center px-4 py-8">
          <div className="w-full max-w-4xl text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#00c49f] mb-4">
              Find Your Perfect Part-Time Job
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto mb-8">
              Connect with trusted employers and motivated job seekers across Sri Lanka.
            </p>

            {step === 1 && (
              <RoleSelection
                role={role}
                setRole={setRole}
                onSelectSeeker={handleSeekerSelect}
                onSelectEmployerType={handleEmployerTypeSelect}
              />
            )}
          </div>

          {step > 1 && (
            <div className="w-full max-w-md bg-[#252525]/90 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-gray-800">
              {step === 2 && (
                <RegisterForm
                  role={role}
                  employerType={employerType}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  onNext={() => setStep(3)}
                  onBack={handleBack}
                />
              )}

              {step === 3 && (
                <ProfileCompletionForm
                  employerType={employerType}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  onBack={handleBack}
                  onSubmit={handleFinalSubmit}
                />
              )}

              
            </div>

            
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}