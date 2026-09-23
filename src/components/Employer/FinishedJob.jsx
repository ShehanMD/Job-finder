import React from 'react';
import Button from '../Ui/Button';

export default function FinishedJobs({ finishedJobs = [], onBackClick }) {
  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          Finished <span className="text-[#00c49f]">Jobs</span>
        </h2>
        {onBackClick && (
          <Button variant="gray" onClick={onBackClick}>
            ← Back
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {finishedJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-[#222522] rounded-2xl border border-zinc-800">
            No finished jobs available yet.
          </div>
        ) : (
          finishedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#222522] border border-zinc-800 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-500/20 text-[#00c49f] border border-[#00c49f]/30">
                      Finished
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>📁 {job.category}</span>
                    <span className="text-emerald-400 font-medium">💵 {job.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}