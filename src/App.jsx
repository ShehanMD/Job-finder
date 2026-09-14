/* import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App */

/*import Button from './components/Ui/Button'
import Input from './components/Ui/Input'
import { Navbar } from './components/layout/Navbar'
import './App.css'
function App() {

  const handleChange = (e) => {
    console.log(e.target.value)
  }
  return (
    <div className="flex gap-4 p-10">

      <Navbar></Navbar>


      
      <h1 style={{ padding: "100px" }}>This is the home</h1>


    </div>
  );
}
export default App;*/

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
    // මෙන්න මෙතැන bgImage භාවිතා කර ඇත
    <div 
      className="min-h-screen text-white flex flex-col justify-between bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Dark Overlay (Text පැහැදිලිව පෙනීමට) */}
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