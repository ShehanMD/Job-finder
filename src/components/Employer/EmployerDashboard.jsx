import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import EmployerOverview from './EmployerOverview';
import PostJobForm from './PostJobForm';

export default function EmployerDashboard() {
  // Navigation Screens පාලනය කරන State එක
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Stat Cards වල Dynamic Data
  const [stats, setStats] = useState({
    activeJobs: 5,
    receivedApplications: 75,
    finishedJobs: 15
  });

  const handleSignOut = () => {
    console.log("Sign Out clicked");
    // Sign out කිරීමට අදාළ Logic එක මෙතැනට එකතු කරන්න
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col relative pt-28">
      {/* Dynamic Navbar Component */}
      <Navbar transparent={true}
        isLoggedIn={true} 
        onSignOutClick={handleSignOut}
        onNavClick={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col justify-center">
        {activeTab === 'overview' && (
          <EmployerOverview 
            stats={stats}
            onPostJobClick={() => setActiveTab('postJob')} 
            onSeeJobsClick={() => setActiveTab('yourJobs')}
            onActiveJobsClick={() => setActiveTab('yourJobs')}
            onApplicationsClick={() => setActiveTab('applications')}
            onFinishedJobsClick={() => setActiveTab('finishedJobs')}
          />
        )}

        {/* ඊළඟට සදන components (PostJobForm, YourJobs, ApplicationCenter) පහතින් එකතු කළ හැක */}
        {/* මෙන්න මේ අලුත් කොටස තමයි එකතු කරන්න ඕනේ */}
        {activeTab === 'postJob' && (
          <PostJobForm onJobPosted={(tab) => setActiveTab(tab)} />
        )}
      </main>
    </div>
  );
}