import React from 'react';
import Button from '../Ui/Button';

export default function EmployerOverview({ 
  stats = { activeJobs: 5, receivedApplications: 75, finishedJobs: 15 },
  onPostJobClick, 
  onSeeJobsClick,
  onActiveJobsClick,
  onApplicationsClick,
  onFinishedJobsClick 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8">
        <span className="text-[#00c49f]">Welcome</span> Name
      </h1>

      {/* Buttons */}
      <div className="flex gap-6 mb-12">
        <Button onClick={onPostJobClick} variant="primary">
          Post job
        </Button>
        <Button onClick={onSeeJobsClick} variant="primary">
          See your jobs
        </Button>
      </div>

      {/* Dynamic Stat Cards 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Active Jobs Card */}
        <button
          onClick={onActiveJobsClick || onSeeJobsClick}
          className="bg-[#222522] border border-zinc-800 hover:border-[#00c49f] rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
        >
          <span className="text-5xl font-bold text-white mb-3">{stats.activeJobs}</span>
          <span className="text-[#00c49f] text-sm font-medium">Active jobs</span>
        </button>

        {/* Received Applications Card */}
        <button
          onClick={onApplicationsClick}
          className="bg-[#222522] border border-zinc-800 hover:border-[#00c49f] rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
        >
          <span className="text-5xl font-bold text-white mb-3">{stats.receivedApplications}</span>
          <span className="text-[#00c49f] text-sm font-medium">Received Applications</span>
        </button>

        {/* Finished Jobs Card */}
        <button
          onClick={onFinishedJobsClick}
          className="bg-[#222522] border border-zinc-800 hover:border-[#00c49f] rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
        >
          <span className="text-5xl font-bold text-white mb-3">{stats.finishedJobs}</span>
          <span className="text-[#00c49f] text-sm font-medium">Finished jobs</span>
        </button>
      </div>
    </div>
  );
}