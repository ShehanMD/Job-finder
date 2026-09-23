import React from 'react';
import Button from '../Ui/Button';

export default function EmployerOverview({ 
  name = "Employer",
  stats = { activeJobs: 0, receivedApplications: 0, finishedJobs: 0 },
  onPostJobClick, 
  onSeeJobsClick,
  onActiveJobsClick,
  onApplicationsClick,
  onFinishedJobsClick 
}) {
  return (
    <div className="overview-container relative flex flex-col items-center justify-center min-h-[75vh] text-center px-4 py-8">
      
      {/* Background Ambient Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00c49f]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header / Hero Section */}
      <div className="overview-header max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00c49f]/10 border border-[#00c49f]/30 text-[#00c49f] text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-[#00c49f] animate-pulse"></span>
          Employer Dashboard
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          <span className="text-[#00c49f]">Welcome back,</span> {name}
        </h1>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Manage your job postings, track candidate applications, and oversee ongoing operations seamlessly.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="overview-actions flex flex-wrap justify-center gap-4 mb-14 w-full max-w-md">
        <Button 
          onClick={onPostJobClick} 
          variant="primary"
          className="flex-1 min-w-[160px] shadow-lg shadow-[#00c49f]/10 hover:shadow-[#00c49f]/20 transition-all"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Post New Job
          </span>
        </Button>

        <Button 
          onClick={onSeeJobsClick} 
          variant="gray"
          className="flex-1 min-w-[160px] bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View Your Jobs
          </span>
        </Button>
      </div>

      {/* Dynamic Stat Cards Section */}
      <div className="overview-stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Active Jobs Card */}
        <button
          onClick={onActiveJobsClick || onSeeJobsClick}
          className="stat-card group relative bg-gradient-to-b from-[#252825] to-[#1c1e1c] border border-zinc-800/80 hover:border-[#00c49f] rounded-2xl p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-20 h-20 text-[#00c49f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00c49f]/10 rounded-xl border border-[#00c49f]/20 text-[#00c49f]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#00c49f] border border-[#00c49f]/20">
              Live Listings
            </span>
          </div>

          <div className="stat-value text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
            {stats.activeJobs}
          </div>
          <div className="text-[#00c49f] text-sm font-semibold flex items-center justify-between">
            <span>Active Jobs</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Received Applications Card */}
        <button
          onClick={onApplicationsClick}
          className="stat-card group relative bg-gradient-to-b from-[#252825] to-[#1c1e1c] border border-zinc-800/80 hover:border-[#00c49f] rounded-2xl p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-20 h-20 text-[#00c49f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00c49f]/10 rounded-xl border border-[#00c49f]/20 text-[#00c49f]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00c49f]/10 text-[#00c49f] border border-[#00c49f]/20">
              Total Responses
            </span>
          </div>

          <div className="stat-value text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
            {stats.receivedApplications}
          </div>
          <div className="text-[#00c49f] text-sm font-semibold flex items-center justify-between">
            <span>Received Applications</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Finished Jobs Card */}
        <button
          onClick={onFinishedJobsClick}
          className="stat-card group relative bg-gradient-to-b from-[#252825] to-[#1c1e1c] border border-zinc-800/80 hover:border-[#00c49f] rounded-2xl p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-20 h-20 text-[#00c49f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00c49f]/10 rounded-xl border border-[#00c49f]/20 text-[#00c49f]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00c49f]/10 text-[#00c49f] border border-[#00c49f]/20">
              Completed
            </span>
          </div>

          <div className="stat-value text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
            {stats.finishedJobs}
          </div>
          <div className="text-[#00c49f] text-sm font-semibold flex items-center justify-between">
            <span>Finished Jobs</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

      </div>
    </div>
  );
}