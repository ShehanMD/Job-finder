import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeekerOverview from './SeekerOverview';
import Timer from '../Ui/Timer';
import './Dashboard.css';
import Navbar from '../layout/Navbar'
import Button from '../Ui/Button'
import { ThreeDot } from 'react-loading-indicators';


export default function SeekerDashboard() {
    // 0: Overview, 1: Job Details (Popup), 2: Waiting, 3: Share Location, 4: Working
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleNextTestStep = () => {
        setCurrentStep((prev) => (prev >= 4 ? 0 : prev + 1));
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setCurrentStep(1);
    };

    const closePopup = () => {
        setSelectedJob(null);
        setCurrentStep(0);
    };

    return (
        <>
            <Navbar 
                transparent={true}
                isLoggedIn={true} 
                onSignOutClick={() => console.log("Sign Out")}
                onNavClick={(tab) => setActiveTab(tab)}
            
            />

            <div className="seeker-dashboard-container">
                {/* Step 0: Overview Component (Background එක විදිහට හැමවෙලේම තියෙනවා Popup එක එද්දි) */}
                <SeekerOverview onJobClick={handleJobClick} />

                <AnimatePresence>
                    {/* Step 1: Job Details Popup */}
                    {currentStep === 1 && (
                        <motion.div 
                            className="popup-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div 
                                className="job-details-popup"
                                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="popup-content-wrapper">
                                    {/* Left Side Profile Info */}
                                    <div className="popup-left-side">
                                        <div className="company-logo-placeholder">
                                            <img src="https://via.placeholder.com/80" alt="Company Logo" className="popup-logo" />
                                        </div>
                                        <h3 className="popup-company-name">Sri Part Time Jobs</h3>
                                        <p className="popup-company-info">Reg no : W/H -12308</p>
                                        <p className="popup-company-info">Contact Us : 077 777 66 55</p>
                                    </div>

                                    {/* Middle Details List */}
                                    <div className="popup-middle-side">
                                        <h3 className="popup-section-title">More Details</h3>
                                        <ul className="popup-details-list">
                                            <li>{selectedJob?.title || 'Packing and delivery'}</li>
                                            <li>{selectedJob?.time || '8.00 am - 5 pm'}</li>
                                            <li>8 Hours</li>
                                            <li>no experiences required</li>
                                            <li>Males only</li>
                                            <li>{selectedJob?.payment || 'Rs. 2500'}</li>
                                            <li>15</li>
                                            <li>{selectedJob?.location || 'Udahamulla, Kotte'}</li>
                                            <li>Lunch & Tea will be provided</li>
                                        </ul>
                                    </div>

                                    {/* Right Side Map & Buttons */}
                                    <div className="popup-right-side">
                                        <h3 className="popup-section-title">Location On Map</h3>
                                        <div className="popup-map-placeholder">
                                            <img src="https://via.placeholder.com/200x200?text=Map+View" alt="Map" />
                                        </div>
                                        <div className="popup-action-buttons">
                                            <button className="btn-popup-back" onClick={closePopup}>Back</button>
                                            <button className="btn-popup-apply" onClick={() => setCurrentStep(2)}>Apply</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

               
                <AnimatePresence>
                    {currentStep >= 2 && (
                        <motion.div 
                            className="status-full-screen-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Header placeholder - ඔයාගේ navbar එක මෙතන තියෙනවා කියලා හිතමු */}
                            <div className="status-header-placeholder"></div>

                            <div className="status-content">
                                <h1 className="status-job-title">{selectedJob?.title || 'Packing and delivery'}</h1>

                                {/* View Workers List Button (Image 3 & 4) */}
                                <div className="view-workers-container">
                                    <Button className="btn-view-workers">View current workers list</Button>
                                </div>

                                {/* Timer Component */}
                                <Timer isActive={currentStep === 4} totalHours={8} />

                                {/* Status Actions */}
                                <div className="status-actions-container">
                                    {currentStep === 2 && (
                                        <motion.div
                                            className="action-wrapper"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.h2 
                                                className="waiting-heading"
                                                animate={{ opacity: [1, 0.3, 1] }} 
                                                transition={{ 
                                                    repeat: Infinity, 
                                                    duration: 1,    
                                                    ease: "easeInOut" 
                                                }}
                                            >
                                                Waiting for approval...
                                                
                                            </motion.h2>
                                            <ThreeDot variant="bob" color="#00c49f" size="medium" text="" textColor="" />
                                            <div className="loading-dots">
                                                <span className="dot"></span>
                                                <span className="dot"></span>
                                                <span className="dot"></span>
                                            </div>
                                        </motion.div> 
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="action-wrapper">
                                            <button className="btn-share-location" onClick={() => setCurrentStep(4)}>Share location</button>
                                            <p className="warning-text-small">Warning: You can not start work until you share your current location</p>
                                        </motion.div>
                                    )}

                                    {currentStep === 4 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="action-wrapper">
                                            <button className="btn-quit-work" onClick={() => setCurrentStep(0)}>Quit Work</button>
                                            <p className="warning-text-small">Warning: If you quit your current job, you'll not get payed</p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Temporary test button */}
                <div className="test-controls">
                    <p>Current Step: {currentStep}</p>
                    <button onClick={handleNextTestStep} className="btn-test">
                        Go to Next Step
                    </button>
                </div>
            </div>
        </>
    );
}