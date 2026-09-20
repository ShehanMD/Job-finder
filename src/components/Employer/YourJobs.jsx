import React, { useState } from 'react';
import Button from '../Ui/Button'; 

export default function YourJobs({ onBackClick, onViewApplications }) {
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Mock Data (Job Description එකතු කර ඇත)
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Naviina DSI warehouse',
      category: 'Warehouse & Logistics',
      type: 'Part-time',
      salary: 'LKR 2500 / day',
      workingHours: '12 Hours / day',
      postedDate: 'Yesterday',
      positionsNeeded: 5,
      appliedCount: 24,
      hiredCount: 2,
      status: 'Active',
      jobStarted: false,
      description: 'DSI showroom බඩු තොග ගණනය කිරීම්, පැටවීම් සහ බෑම් සඳහා උද්‍යෝගිමත් සේවකයින් අවශ්‍යයි. ආහාර පහසුකම් සපයනු ලැබේ.'
    },
    {
      id: 2,
      title: 'Udahamulla',
      category: 'Delivery & Logistics',
      type: 'Part-time',
      salary: 'LKR 3,500 / day',
      workingHours: '12 Hours / day',
      postedDate: 'Yesterday',
      positionsNeeded: 2,
      appliedCount: 15,
      hiredCount: 1,
      status: 'Active',
      jobStarted: true,
      description: 'උඩහමුල්ල ප්‍රදේශය වටා පාර්සල් බෙදාහැරීමේ කටයුතු සඳහා රයිඩර්වරුන් අවශ්‍යයි. තමන්ගේම යතුරුපැදියක් තිබීම අනිවාර්ය වේ.'
    },
    {
      id: 3,
      title: 'Waiter',
      category: 'Hotel & Restaurant',
      type: 'Part-time',
      salary: 'LKR 1800 / day',
      workingHours: '8 Hours / day',
      postedDate: '3 days ago',
      positionsNeeded: 3,
      appliedCount: 36,
      hiredCount: 3,
      status: 'Active',
      jobStarted: false,
      description: 'ආපනශාලාවේ පාරිභෝගිකයින්ට ආහාර සැපයීම සහ පිරිසිදුකම පවත්වා ගැනීම. පූර්ව පළපුරුද්ද අමතර සුදුසුකමකි.'
    }
  ]);

  const toggleJobDetails = (id) => {
    setSelectedJobId(selectedJobId === id ? null : id);
  };

  // Start Job Click Event Handler
  const handleStartJob = (e, jobId) => {
    e.stopPropagation();
    
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, jobStarted: true } : job
    ));

    console.log(`Job ${jobId} Started`);
    alert("Job execution started successfully!");
  };

  // End Job Click Event Handler
  const handleEndJob = (e, jobId) => {
    e.stopPropagation();

    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'Completed', jobStarted: false } : job
    ));

    console.log(`Job ${jobId} Ended`);
    alert("Job marked as completed!");
  };

  const handleViewGroup = (e, jobId) => {
    e.stopPropagation();
    console.log(`Navigating to group for Job ${jobId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          Your Posted <span className="text-[#00c49f]">Jobs</span>
        </h2>
        {onBackClick && (
          <Button variant="gray" onClick={onBackClick}>
            ← Back to Overview
          </Button>
        )}
      </div>

      {/* Job Cards List */}
      <div className="flex flex-col gap-4">
        {jobs.map((job) => {
          const isExpanded = selectedJobId === job.id;

          return (
            <div
              key={job.id}
              className={`bg-[#222522] border rounded-2xl p-6 transition-all cursor-pointer ${
                isExpanded ? 'border-[#00c49f]' : 'border-zinc-800 hover:border-zinc-700'
              }`}
              onClick={() => toggleJobDetails(job.id)}
            >
              {/* Card Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        job.status === 'Active'
                          ? 'bg-emerald-500/20 text-[#00c49f] border border-[#00c49f]/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>📁 {job.category}</span>
                    <span>💼 {job.type}</span>
                    <span className="text-emerald-400 font-medium">💵 {job.salary}</span>
                  </div>
                </div>

                {/* View Applications Main Action */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onViewApplications) onViewApplications(job.id);
                    }}
                  >
                    View Applications
                  </Button>
                </div>
              </div>

              {/* Expand View Details */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-col gap-6">
                  
                  {/* Analytics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 1. Offered Salary */}
                    <div className="bg-[#1a1c1a] p-4 rounded-xl border border-zinc-800/80">
                      <span className="text-xs text-gray-400 block mb-1">Offered Salary</span>
                      <span className="text-base font-bold text-emerald-400">{job.salary}</span>
                    </div>

                    {/* 2. Total Working Hours */}
                    <div className="bg-[#1a1c1a] p-4 rounded-xl border border-zinc-800/80">
                      <span className="text-xs text-gray-400 block mb-1">Allocated Hours</span>
                      <span className="text-base font-bold text-yellow-400">⏱️ {job.workingHours}</span>
                    </div>

                    {/* 3. Positions Needed */}
                    <div className="bg-[#1a1c1a] p-4 rounded-xl border border-zinc-800/80">
                      <span className="text-xs text-gray-400 block mb-1">Positions Needed</span>
                      <span className="text-base font-bold text-white">{job.positionsNeeded}</span>
                    </div>

                    {/* 4. Hired / Selected */}
                    <div className="bg-[#1a1c1a] p-4 rounded-xl border border-zinc-800/80">
                      <span className="text-xs text-gray-400 block mb-1">Hired / Positions</span>
                      <span className="text-base font-bold text-blue-400">
                        {job.hiredCount} / {job.positionsNeeded}
                      </span>
                    </div>
                  </div>

                  {/* Job Description Section */}
                  <div className="bg-[#1a1c1a] p-4 rounded-xl border border-zinc-800/80">
                    <span className="text-xs text-gray-400 block mb-2 font-medium">Job Description</span>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                      {job.description || "විස්තරයක් ඇතුළත් කර නොමැත."}
                    </p>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <Button 
                      variant="gray" 
                      onClick={(e) => handleViewGroup(e, job.id)}
                    >
                      👥 View Group
                    </Button>

                    <Button 
                      variant="primary" 
                      onClick={(e) => handleStartJob(e, job.id)}
                    >
                      ▶ Start Job
                    </Button>

                    <button
                      className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-lg text-sm font-medium transition-all"
                      onClick={(e) => handleEndJob(e, job.id)}
                    >
                      ⏹ End Job
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}                                             