
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../layout/Navbar';
import EmployerOverview from './EmployerOverview';
import PostJobForm from './PostJobForm';
import YourJobs from './YourJobs';
import FinishedJobs from './FinishedJob';

import { useAuth } from '../auth/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';
import './employer-dashboard.css';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  // Logout Function
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  // Active Jobs
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

  // Finished Jobs
  const [finishedJobs, setFinishedJobs] = useState([]);

  // Add New Job
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

    setJobs([newJob, ...jobs]);
    setActiveTab('yourJobs');
  };

  // Finish Job
  const handleFinishJob = (finishedJobData) => {
    setJobs(jobs.filter((job) => job.id !== finishedJobData.id));
    setFinishedJobs([finishedJobData, ...finishedJobs]);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col relative pt-28">

      <Navbar
        transparent={true}
        isLoggedIn={isLoggedIn}
        onSignOutClick={handleLogout}
        onNavClick={(tab) => setActiveTab(tab)}
      />

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col justify-center">

        <AnimatePresence mode="wait">

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <EmployerOverview
                stats={{
                  activeJobs: jobs.length,
                  receivedApplications: 75,
                  finishedJobs: finishedJobs.length
                }}
                onPostJobClick={() => setActiveTab('postJob')}
                onSeeJobsClick={() => setActiveTab('yourJobs')}
                onActiveJobsClick={() => setActiveTab('yourJobs')}
                onApplicationsClick={() => setActiveTab('applications')}
                onFinishedJobsClick={() => setActiveTab('finishedJobs')}
              />
            </motion.div>
          )}

          {activeTab === 'postJob' && (
            <motion.div
              key="postJob"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <PostJobForm onJobPosted={handleAddJob} />
            </motion.div>
          )}

          {activeTab === 'yourJobs' && (
            <motion.div
              key="yourJobs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <YourJobs
                jobs={jobs}
                setJobs={setJobs}
                onJobFinished={handleFinishJob}
                onBackClick={() => setActiveTab('overview')}
                onViewApplications={(jobId) => setActiveTab('applications')}
              />
            </motion.div>
          )}

          {activeTab === 'finishedJobs' && (
            <motion.div
              key="finishedJobs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <FinishedJobs
                finishedJobs={finishedJobs}
                onBackClick={() => setActiveTab('overview')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
