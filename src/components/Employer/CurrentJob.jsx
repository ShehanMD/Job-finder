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

        // Fetch current Job ID
        const CurrentJobID = await customBase.db.get(`USER/${user.uid}/CJID`); // CJID - Curent Job ID
        console.log(`CurrentJobID :`, CurrentJobID);

        
        let job;
        if (CurrentJobID) {
          // currentJob contains a job ID
          job = await customBase.db.get(`JOBS/${CurrentJobID}`);
        }

        if (!cancelled) {
          setJob(
            job && typeof job === "object"
              ? job
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

  /*
   // මෙහෙම ඔබ්ජෙක්ට් එකක් තමා එන්නෙ
  const job = { 
  "CM": "ABC Technologies (Pvt) Ltd",  
  "R": "Software Engineer Intern", 
  "D": "https://example.com/company-logo.png",

  "A": 125, 
  "C": 200,  

  "PT": "Paid Internship", 
  "P": 2500,      
  "PP": "day",    
  "S": "Rs. 75,000/month", 

  "L": "Colombo 03",      
  "CT": "Colombo",         

  "W": "8:30 AM - 5:00 PM", 
  "ST": "8:30 AM",          
  "ET": "5:00 PM"          
}; */



  // Prepare values from the database
  const companyName = job.CM || "Company name";
  const jobRole =    job.R || "Job role";
  const companyLogo = job.D ||companyName.substring(0, 3).toUpperCase();  // company dp
  const applicants = job.A ?? 0;
  const capacity = job.C ?? job.MA;  // capacity max aplicants

  const capacityText =
    capacity != null
      ? `${applicants}/${capacity}`
      : `${applicants}`;

  const paymentText =
    job.PT ||   // payment text                     
    (job.P != null
      ? `Rs. ${Number(job.P).toLocaleString()}/${
          job.PP || "day"  // payment period
        }`
      : job.S != null  // sallary
      ? String(job.S)
      : "Payment not specified");

  const location =job.L || job.CT || "Location not specified";   // location / city

  const workingHours =
    job.W ||   // workkers
    (job.ST || job.ET    // start time / end time
      ? `${job.ST || "—"} - ${job.ET || "—"}`
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
          <img className="up-company-logo" src={companyLogo} alt="" />
          

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