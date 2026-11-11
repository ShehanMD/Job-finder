import React, { useState , useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Ui/Button';
import ApplicationCenter from './ApplicationCenter';
import { customBase } from "../firebase/customBase";


async function getMyJobs() {
  return await customBase.db.query('JOBS', {
    orderBy: 'uid',
    equalTo: '89RiJcPYpBYBuMzXFzb3TRbzZQP2'
  });
}


export default function YourJobs({ onBackClick, onViewApplications, onJobFinished }) {
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load jobs
useEffect(() => {
  const loadJobs = async () => {
    try {
      const myJobs = await getMyJobs();

      console.log("Raw My Jobs Data:", myJobs);

      let jobsArray = [];

      if (Array.isArray(myJobs)) {
        jobsArray = myJobs;
      } else if (myJobs && typeof myJobs === 'object') {
        jobsArray = Object.entries(myJobs).map(([key, value]) => ({
          id: value?.id || key,
          ...value
        }));
      }

      setJobs(jobsArray);

    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  loadJobs();
}, []);

  // Helpers
  const toggleJobDetails = (id) => {
    setSelectedJobId(prev => prev === id ? null : id);
  };

  const updateJob = (jobId, updates) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  // Start Job
  const handleStartJob = (e, jobId) => {
    e.stopPropagation();

    updateJob(jobId, { jobStarted: true });
    alert("Job execution started successfully!");
  };

  // End Job
  const handleEndJob = (e, jobId) => {
    e.stopPropagation();

    updateJob(jobId, {
      status: 'Completed',
      jobStarted: false
    });

    alert("Job marked as completed! You can now finish this job.");
  };

  // Finish Job
  const handleFinishJob = (e, jobId) => {
    e.stopPropagation();

    const finishedJob = jobs.find(job => job.id === jobId);
    if (!finishedJob) return;

    setJobs(prev => prev.filter(job => job.id !== jobId));

    if (onJobFinished) {
      onJobFinished(finishedJob);
    }

    setSelectedJobId(null);
    alert("Job moved to Finished Jobs!");
  };

  // View Group
  const handleViewGroup = (e, jobId) => {
    e.stopPropagation();
    console.log(`Navigating to group for Job ${jobId}`);
  };

  // Applications
  const handleViewApplications = (e, jobId) => {
    e.stopPropagation();
    setViewingApplicantsFor(jobId);
  };

  const handleCloseApplications = () => {
    setViewingApplicantsFor(null);
  };

  // Applications screen
  if (viewingApplicantsFor) {
    return (
      <ApplicationCenter
        jobId={viewingApplicantsFor}
        onClose={handleCloseApplications}
      />
    );
  }

  // UI helpers
  const getJobTitle = (job) => job.JT || 'Untitled Job';
  const getSalary = (job) => job.PY || 'Not specified';
  const getPositions = (job) => job.EMP ?? 0;
  const getDescription = (job) => job.DS || 'No description provided.';

  const getStatusStyle = (status) => {
    if (status === 'Active') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }

    if (status === 'Completed') {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }

    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-5"
    >

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold">
              Employer Dashboard
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Posted <span className="text-emerald-400">Jobs</span>
          </h2>

          <p className="text-sm text-zinc-500 mt-2">
            Manage your opportunities, employees and applications.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-xs text-zinc-500 block">Total Jobs</span>
            <span className="text-xl font-bold text-white tabular-nums">
              {jobs.length}
            </span>
          </div>

          {onBackClick && (
            <Button variant="gray" onClick={onBackClick}>
              ← Back
            </Button>
          )}
        </div>
      </div>

      {/* JOB LIST */}
      <div className="flex flex-col gap-4">

        {loading ? (

          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-zinc-400">Loading your jobs...</p>
          </div>

        ) : jobs.length === 0 ? (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative overflow-hidden text-center py-16 px-6 rounded-3xl bg-zinc-900/60 border border-zinc-800"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5 text-3xl">
              💼
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              No Jobs Found
            </h3>

            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              You haven't posted any jobs yet. Your posted opportunities will appear here.
            </p>
          </motion.div>

        ) : (

          <AnimatePresence mode="popLayout">

            {jobs.map((job, index) => {
              const isExpanded = selectedJobId === job.id;
              const title = getJobTitle(job);
              const salary = getSalary(job);
              const positions = getPositions(job);
              const isCompleted = job.status === 'Completed';

              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isExpanded
                      ? 'bg-[#191e1c] border-emerald-500/40 shadow-[0_10px_40px_rgba(16,185,129,0.06)]'
                      : 'bg-[#1b1d1c] border-zinc-800 hover:border-zinc-700'
                  }`}
                >

                  {/* ACCENT LINE */}
                  <div className={`absolute top-0 left-0 w-full h-[2px] transition-opacity ${
                    isExpanded ? 'bg-emerald-400 opacity-100' : 'bg-emerald-400 opacity-0 group-hover:opacity-50'
                  }`} />

                  {/* MAIN CARD */}
                  <div
                    className="p-5 sm:p-6 cursor-pointer"
                    onClick={() => toggleJobDetails(job.id)}
                  >

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                      {/* JOB IDENTITY */}
                      <div className="flex gap-4 min-w-0">

                        <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                          💼
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2 mb-2">

                            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                              {title}
                            </h3>

                            <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-bold ${getStatusStyle(job.status)}`}>
                              {job.status || 'Pending'}
                            </span>

                            {job.jobStarted && (
                              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                RUNNING
                              </span>
                            )}

                          </div>

                          {/* JOB METADATA */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">

                            {job.category && (
                              <span className="flex items-center gap-1.5">
                                <span>📁</span> {job.category}
                              </span>
                            )}

                            {job.type && (
                              <span className="flex items-center gap-1.5">
                                <span>💼</span> {job.type}
                              </span>
                            )}

                            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                              <span>💰</span> {salary}
                            </span>

                          </div>
                        </div>
                      </div>

                      {/* CARD ACTIONS */}
                      <div className="flex items-center justify-between md:justify-end gap-3">

                        <Button
                          variant="primary"
                          onClick={(e) => handleViewApplications(e, job.id)}
                        >
                          <span className="flex items-center gap-2">
                            <span>Applications</span>
                            <span>↗</span>
                          </span>
                        </Button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJobDetails(job.id);
                          }}
                          className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center text-zinc-400 hover:text-white transition-all ${
                            isExpanded
                              ? 'bg-emerald-500/10 border-emerald-500/30 rotate-180'
                              : 'bg-zinc-900 border-zinc-800'
                          }`}
                          aria-label="Toggle job details"
                        >
                          ↓
                        </button>

                      </div>
                    </div>
                  </div>

                  {/* EXPANDED CONTENT */}
                  <AnimatePresence initial={false}>

                    {isExpanded && (

                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >

                        <div className="px-5 sm:px-6 pb-6">

                          <div className="border-t border-zinc-800 pt-6 flex flex-col gap-6">

                            {/* OVERVIEW STATS */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

                              <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                                  Offered Salary
                                </span>
                                <p className="text-lg font-bold text-emerald-400 mt-2 break-words">
                                  {salary}
                                </p>
                              </div>

                              <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                                  Working Hours
                                </span>
                                <p className="text-lg font-bold text-amber-400 mt-2">
                                  {job.workingHours || 'Not specified'}
                                </p>
                              </div>

                              <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                                  Positions Needed
                                </span>
                                <p className="text-lg font-bold text-white mt-2">
                                  {positions}
                                </p>
                              </div>

                              <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                                  Hired / Positions
                                </span>
                                <p className="text-lg font-bold text-blue-400 mt-2">
                                  {job.hiredCount ?? 0} / {positions}
                                </p>
                              </div>

                            </div>

                            {/* JOB INFORMATION */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                              <div className="bg-zinc-900/80 rounded-xl p-5 border border-zinc-800">
                                <div className="flex items-center gap-2 mb-3">
                                  <span>📋</span>
                                  <h4 className="text-sm font-bold text-white">
                                    Job Description
                                  </h4>
                                </div>

                                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                                  {getDescription(job)}
                                </p>
                              </div>

                              <div className="bg-zinc-900/80 rounded-xl p-5 border border-zinc-800">
                                <div className="flex items-center gap-2 mb-3">
                                  <span>📍</span>
                                  <h4 className="text-sm font-bold text-white">
                                    Location & Requirements
                                  </h4>
                                </div>

                                <p className="text-sm text-zinc-300 mb-3">
                                  {job.location || 'Location not specified'}
                                </p>

                                <div className="border-t border-zinc-800 pt-3">
                                  <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">
                                    Requirements
                                  </p>

                                  <p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">
                                    {job.requirements || 'No specific requirements provided.'}
                                  </p>
                                </div>
                              </div>

                            </div>

                            {/* JOB SCHEDULE */}
                            <div className="bg-zinc-900/80 rounded-xl p-5 border border-zinc-800">

                              <div className="flex items-center gap-2 mb-4">
                                <span>📅</span>
                                <h4 className="text-sm font-bold text-white">
                                  Job Schedule
                                </h4>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    Date
                                  </span>
                                  <p className="text-sm text-zinc-200 mt-1">
                                    {job.jobDateDay && job.jobDateMonth && job.jobDateYear
                                      ? `${job.jobDateDay}/${job.jobDateMonth}/${job.jobDateYear}`
                                      : 'Not specified'}
                                  </p>
                                </div>

                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    Start Time
                                  </span>
                                  <p className="text-sm text-zinc-200 mt-1">
                                    {job.startHour
                                      ? `${job.startHour}:${job.startMin || '00'} ${job.startAmPm || 'AM'}`
                                      : 'Not specified'}
                                  </p>
                                </div>

                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    End Time
                                  </span>
                                  <p className="text-sm text-zinc-200 mt-1">
                                    {job.endHour
                                      ? `${job.endHour}:${job.endMin || '00'} ${job.endAmPm || 'PM'}`
                                      : 'Not specified'}
                                  </p>
                                </div>

                              </div>
                            </div>

                            {/* ACTION FOOTER */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">

                              <div className="text-xs text-zinc-500">
                                Job Management
                                <span className="text-zinc-700 mx-2">/</span>
                                <span className="text-zinc-400">{title}</span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">

                                <Button
                                  variant="gray"
                                  onClick={(e) => handleViewGroup(e, job.id)}
                                >
                                  👥 View Group
                                </Button>

                                {isCompleted ? (

                                  <Button
                                    variant="primary"
                                    onClick={(e) => handleFinishJob(e, job.id)}
                                  >
                                    ✓ Finish Job
                                  </Button>

                                ) : (

                                  <>
                                    {!job.jobStarted && (
                                      <Button
                                        variant="primary"
                                        onClick={(e) => handleStartJob(e, job.id)}
                                      >
                                        ▶ Start Job
                                      </Button>
                                    )}

                                    <button
                                      className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                      onClick={(e) => handleEndJob(e, job.id)}
                                    >
                                      ⏹ End Job
                                    </button>
                                  </>

                                )}

                              </div>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>

                </motion.div>
              );
            })}

          </AnimatePresence>
        )}

      </div>
    </motion.div>
  );
}
