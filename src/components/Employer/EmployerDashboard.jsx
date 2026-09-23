
// import React, { useState } from 'react';
// import Navbar from '../layout/Navbar';
// import EmployerOverview from './EmployerOverview';
// import PostJobForm from './PostJobForm';
// import YourJobs from './YourJobs';
// import './employer-dashboard.css';

// export default function EmployerDashboard() {
//   const [activeTab, setActiveTab] = useState('overview');

//   // 1. Jobs ලැයිස්තුව Dashboard එකේ State එකක් ලෙස තබාගැනීම
//   const [jobs, setJobs] = useState([
//     {
//       id: 1,
//       title: 'Senior React Developer',
//       category: 'Software Engineering',
//       type: 'Full-time',
//       postedDate: 'Yesterday',
//       applicantsCount: 24,
//       status: 'Active'
//     }
//   ]);

//   // 2. අලුත් Job එකක් Add කරන Function එක
//   const handleAddJob = (newJobData) => {
//     const newJob = {
//       id: jobs.length + 1,
//       ...newJobData,
//       postedDate: 'Just now',
//       applicantsCount: 0,
//       status: 'Active'
//     };
    
//     // පැරණි jobs එක්ක අලුත් job එක එකතු කිරීම
//     setJobs([newJob, ...jobs]);
    
//     // Job එක Post කළ පසු කෙළින්ම Your Jobs tab එකට මාරු කිරීම
//     setActiveTab('yourJobs');
//   };

//   return (
//     <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col relative pt-28">
//       <Navbar 
//         transparent={true}
//         isLoggedIn={true} 
//         onSignOutClick={() => console.log("Sign Out")}
//         onNavClick={(tab) => setActiveTab(tab)}
//       />

//       <main className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col justify-center">
//         {activeTab === 'overview' && (
//           <EmployerOverview 
//             stats={{
//               activeJobs: jobs.length, // Dynamic ලෙස active jobs ගණන පෙන්වයි
//               receivedApplications: 75,
//               finishedJobs: 15
//             }}
//             onPostJobClick={() => setActiveTab('postJob')} 
//             onSeeJobsClick={() => setActiveTab('yourJobs')}
//             onActiveJobsClick={() => setActiveTab('yourJobs')}
//             onApplicationsClick={() => setActiveTab('applications')}
//             onFinishedJobsClick={() => setActiveTab('finishedJobs')}
//           />
//         )}

//         {/* 3. PostJobForm එකට handleAddJob එක Pass කිරීම */}
//         {activeTab === 'postJob' && (
//           <PostJobForm onJobPosted={handleAddJob} />
//         )}

//         {/* 4. YourJobs එකට දැනට තියෙන jobs array එක Pass කිරීම */}
//         {activeTab === 'yourJobs' && (
//           <YourJobs 
//             jobs={jobs}
//             onBackClick={() => setActiveTab('overview')}
//             onViewApplications={(jobId) => setActiveTab('applications')}
//           />
//         )}
//       </main>
//     </div>
//   );
// }



import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import EmployerOverview from './EmployerOverview';
import PostJobForm from './PostJobForm';
import YourJobs from './YourJobs';
import FinishedJobs from './FinishedJob'; // FinishedJobs component එක import කරගන්න
import './employer-dashboard.css';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // 1. Active Jobs ලැයිස්තුව Dashboard එකේ State එකක් ලෙස තබාගැනීම
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      category: 'Software Engineering',
      type: 'Full-time',
      salary: 'LKR 250,000 / month',
      workingHours: '8 Hours / day',
      postedDate: 'Yesterday',
      positionsNeeded: 5,
      appliedCount: 24,
      hiredCount: 2,
      status: 'Active',
      jobStarted: false,
      description: 'DSI showroom බඩු තොග ගණනය කිරීම්, පැටවීම් සහ බෑම් සඳහා උද්‍යෝගිමත් සේවකයින් අවශ්‍යයි.'
    }
  ]);

  // 2. Finished Jobs ලැයිස්තුව තබාගැනීමට අලුත් State එකක්
  const [finishedJobs, setFinishedJobs] = useState([]);

  // 3. අලුත් Job එකක් Add කරන Function එක
  const handleAddJob = (newJobData) => {
    const newJob = {
      id: jobs.length + finishedJobs.length + 1,
      ...newJobData,
      postedDate: 'Just now',
      appliedCount: 0,
      hiredCount: 0,
      status: 'Active',
      jobStarted: false
    };
    
    // පැරණි jobs එක්ක අලුත් job එක එකතු කිරීම
    setJobs([newJob, ...jobs]);
    
    // Job එක Post කළ පසු කෙළින්ම Your Jobs tab එකට මාරු කිරීම
    setActiveTab('yourJobs');
  };

  // 4. Job එකක් Finished වූ විට Active Jobs වලින් ඉවත් කර Finished Jobs වලට එකතු කිරීම
  const handleFinishJob = (finishedJobData) => {
    // Active jobs ලැයිස්තුවෙන් ඉවත් කිරීම
    setJobs(jobs.filter((job) => job.id !== finishedJobData.id));

    // Finished jobs ලැයිස්තුවට එකතු කිරීම
    setFinishedJobs([finishedJobData, ...finishedJobs]);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col relative pt-28">
      <Navbar 
        transparent={true}
        isLoggedIn={true} 
        onSignOutClick={() => console.log("Sign Out")}
        onNavClick={(tab) => setActiveTab(tab)}
      />

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col justify-center">
        {activeTab === 'overview' && (
          <EmployerOverview 
            stats={{
              activeJobs: jobs.length, // Dynamic ලෙස active jobs ගණන පෙන්වයි
              receivedApplications: 75,
              finishedJobs: finishedJobs.length // Dynamic ලෙස finished jobs ගණන පෙන්වයි
            }}
            onPostJobClick={() => setActiveTab('postJob')} 
            onSeeJobsClick={() => setActiveTab('yourJobs')}
            onActiveJobsClick={() => setActiveTab('yourJobs')}
            onApplicationsClick={() => setActiveTab('applications')}
            onFinishedJobsClick={() => setActiveTab('finishedJobs')}
          />
        )}

        {/* PostJobForm Component */}
        {activeTab === 'postJob' && (
          <PostJobForm onJobPosted={handleAddJob} />
        )}

        {/* YourJobs Component */}
        {activeTab === 'yourJobs' && (
          <YourJobs 
            jobs={jobs}
            setJobs={setJobs}
            onJobFinished={handleFinishJob}
            onBackClick={() => setActiveTab('overview')}
            onViewApplications={(jobId) => setActiveTab('applications')}
          />
        )}

        {/* FinishedJobs Component */}
        {activeTab === 'finishedJobs' && (
          <FinishedJobs 
            finishedJobs={finishedJobs}
            onBackClick={() => setActiveTab('overview')}
          />
        )}
      </main>
    </div>
  );
}