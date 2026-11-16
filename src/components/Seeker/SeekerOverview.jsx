import React from 'react';
import { JobCard } from '../jobs/JobCard'; 
import { FaCircle, FaSearch, FaBookmark } from 'react-icons/fa';
import Button from '../Ui/Button';

export default function SeekerOverview({ onJobClick }) {
    const availableJobs = [
        { 
            id: 1, 
            companyName: "ABC Logistics", 
            profilePic: "", 
            filled: 10, 
            total: 50, 
            isUrgent: true, 
            title: "Packing and delivery", 
            payment: "Rs. 2500 / day", 
            location: "Udahamulla, Kotte", 
            time: "8:00 AM - 5:00 PM" 
        },
        { 
            id: 2, 
            companyName: "Fresh Foods Pvt", 
            profilePic: "",
            filled: 4, 
            total: 10, 
            isUrgent: false, 
            title: "Store Assistant", 
            payment: "Rs. 2000 / day", 
            location: "Nugegoda", 
            time: "9:00 AM - 6:00 PM" 
        },
        { 
            id: 3, 
            companyName: "BuildPro Holdings", 
            profilePic: "",
            filled: 15, 
            total: 20, 
            isUrgent: true, 
            title: "Construction Helper", 
            payment: "Rs. 3000 / day", 
            location: "Colombo 03", 
            time: "7:30 AM - 5:30 PM" 
        },
        { 
            id: 4, 
            companyName: "CleanCare Services", 
            profilePic: "",
            filled: 2, 
            total: 5, 
            isUrgent: false, 
            title: "Office Cleaner", 
            payment: "Rs. 1800 / day", 
            location: "Maharagama", 
            time: "8:00 AM - 2:00 PM" 
        }
    ];

    return (
        <div className="modern-overview-container">
            <div className="modern-header-section">
                <div className="top-badge">
                    <FaCircle className="badge-dot" /> SEEKER DASHBOARD
                </div>
                
                <h1 className="modern-main-title">
                    <span className="text-teal">Welcome,</span> <span className="text-white">Name</span>
                </h1>
                
                <p className="modern-subtitle">
                    Manage your job applications, track current work progress, and discover new part-time opportunities seamlessly.
                </p>
                
                <div className="modern-button-group">
                    <Button className="btn-modern-primary">
                        <FaSearch className="btn-icon" /> Explore Jobs
                    </Button>
                    <Button className="btn-modern-secondary" variant='gray'>
                        <FaBookmark className="btn-icon" /> Saved Jobs
                    </Button>
                </div>
            </div>

            <div className="modern-jobs-grid">
                {availableJobs.map((job) => (
                    <JobCard 
                        key={job.id} 
                        companyName={job.companyName}
                        profilePic={job.profilePic}
                        filled={job.filled}
                        total={job.total}
                        isUrgent={job.isUrgent}
                        title={job.title}
                        payment={job.payment}
                        location={job.location}
                        time={job.time}
                        onViewJob={() => onJobClick(job)} 
                    />
                ))}
            </div>
        </div>
    );
}