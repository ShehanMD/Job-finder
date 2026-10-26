import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { customBase } from "../firebase/customBase";
import "./UserProfile.css";

const CurrentJob = ({ onViewJob }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCurrentJob = async () => {
      try {
        // Get the currently logged-in user
        const user = customBase.auth.currentUser();

        if (!user?.uid) {
          if (!cancelled) {
            setError("Please log in to view your job.");
          }
          return;
        }

        // Fetch the user's information
        const userData = await customBase.db.get(
          `USER/${user.uid}`
        );

        // The current job can be an object or a job ID
        let jobData = userData?.currentJob ?? null;

        if (typeof jobData === "string") {
          // currentJob contains a job ID
          jobData = await customBase.db.get(
            `JOBS/${jobData}`
          );
        } else if (!jobData && userData?.currentJobId) {
          // Alternative: store the ID in currentJobId
          jobData = await customBase.db.get(
            `JOBS/${userData.currentJobId}`
          );
        }

        if (!cancelled) {
          setJob(
            jobData && typeof jobData === "object"
              ? jobData
              : null
          );
        }
      } catch (err) {
        console.error("Error loading current job:", err);

        if (!cancelled) {
          setError(
            err?.message || "Unable to load job information."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCurrentJob();

    return () => {
      cancelled = true;
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="up-job-card up-card">
        <p style={{ color: "var(--up-text-muted)" }}>
          Loading your current job...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="up-job-card up-card">
        <p style={{ color: "var(--up-text-muted)" }}>
          {error}
        </p>
      </div>
    );
  }

  // No current job found
  if (!job) {
    return (
      <div className="up-job-card up-card">
        <p style={{ color: "var(--up-text-muted)" }}>
          No current job available.
        </p>
      </div>
    );
  }

  // Prepare values from the database
  const companyName =
    job.companyName || job.company || "Company name";

  const jobRole =
    job.role || job.jobTitle || job.title || "Job role";

  const companyLogo =
    job.companyLogoText ||
    job.logoText ||
    companyName.substring(0, 3).toUpperCase();

  const applicants = job.applicantsCount ?? 0;
  const capacity = job.capacity ?? job.maxApplicants;

  const capacityText =
    capacity != null
      ? `${applicants}/${capacity}`
      : `${applicants}`;

  const paymentText =
    job.payText ||
    (job.pay != null
      ? `Rs. ${Number(job.pay).toLocaleString()}/${
          job.payPeriod || "day"
        }`
      : job.salary != null
      ? String(job.salary)
      : "Payment not specified");

  const location =
    job.location || job.city || "Location not specified";

  const workingHours =
    job.workHours ||
    (job.startTime || job.endTime
      ? `${job.startTime || "—"} - ${job.endTime || "—"}`
      : "Hours not specified");

  return (
    <motion.div
      className="up-job-card up-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="up-job-header">
        <div className="up-job-title-group">
          <div className="up-company-logo">
            {companyLogo}
          </div>

          <h2>{companyName}</h2>
        </div>

        <div className="up-capacity-badge">
          👤 {capacityText}
        </div>
      </div>

      <h3 className="up-job-role">{jobRole}</h3>

      <div className="up-job-details">
        <span>💰 {paymentText}</span>
        <span>📍 {location}</span>
        <span>⏰ {workingHours}</span>
      </div>

      <button
        className="up-btn-primary"
        onClick={() => onViewJob?.(job)}
      >
        View job →
      </button>
    </motion.div>
  );
};

export default CurrentJob;