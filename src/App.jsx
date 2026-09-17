import bgImage from './assets/bg-image.jpg';
import React, { useState } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RoleSelection from './components/auth/RoleSelection';
import RegisterForm from './components/auth/RegisterForm';
import ProfileCompletionForm from './components/auth/ProfileCompletionForm';
import { JobCard } from './components/jobs/JobCard';

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

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", { role, employerType, ...formData });
    alert("Registration Completed Successfully!");
  };

 return (
    <div
      className="min-h-screen text-white flex flex-col justify-between bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Content Area */}
      <motion.div
        className="relative z-10 flex flex-col min-h-screen justify-between"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        
        <main className="flex-1 flex flex-col items-center px-4 pt-24 pb-8 w-full">
          
          
          <div className="w-full flex flex-col justify-center items-center min-h-[70vh]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-4xl text-center"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-[#00c49f] mb-4">
                    Find Your Perfect Part-Time Job
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto mb-8">
                    Connect with trusted employers and motivated job seekers across Sri Lanka.
                  </p>

                  <RoleSelection
                    role={role}
                    setRole={setRole}
                    onSelectSeeker={handleSeekerSelect}
                    onSelectEmployerType={handleEmployerTypeSelect}
                  />
                </motion.div>
              )}

              {step > 1 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md bg-[#252525]/90 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-gray-800"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          
          <div className="w-full max-w-6xl mt-12">
            <div className="flex flex-wrap gap-6 justify-center">
               {}
            </div>
          </div>
          
          <section className="w-full py-20 px-4 bg-[#111111] border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              How It <span className="text-[#00c49f]">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                <div className="w-12 h-12 bg-[#00c49f]/20 text-[#00c49f] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-400 text-sm">Sign up as a job seeker or an employer in just a few clicks.</p>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                <div className="w-12 h-12 bg-[#00c49f]/20 text-[#00c49f] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-2">Find or Post Jobs</h3>
                <p className="text-gray-400 text-sm">Browse through verified listings or post your requirements.</p>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                <div className="w-12 h-12 bg-[#00c49f]/20 text-[#00c49f] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-2">Get Connected</h3>
                <p className="text-gray-400 text-sm">Communicate directly and start your new part-time journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Popular Categories */}
        <section className="w-full py-20 px-4 bg-[#151515] border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-12">
              Popular <span className="text-[#00c49f]">Categories</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Helper', 'Retail & Sales', 'Food & Beverage', 'Packaging', 'Delivery & Logistics', 'Customer Support'].map((cat, index) => (
                <span 
                  key={index} 
                  className="px-6 py-3 bg-[#1a1a1a] border border-gray-700 rounded-full text-gray-300 hover:text-[#00c49f] hover:border-[#00c49f] transition-colors cursor-pointer"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}