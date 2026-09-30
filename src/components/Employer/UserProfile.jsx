import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './UserProfile.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('job');

  // Framer Motion Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="user-profile-page">
      <motion.div 
        className="up-content"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        
        {/* Header Section */}
        <motion.div className="up-header-section" variants={fadeIn}>
          <span className="up-badge">● USER DASHBOARD</span>
          <h1>Welcome back, <span>Name</span></h1>
          <p>Manage your personal information, track active jobs, and oversee your history seamlessly.</p>
        </motion.div>

        {/* Top Section: Avatar and User Details */}
        <div className="up-top-section">
          {/* Avatar Card */}
          <motion.div className="up-avatar-card up-card" variants={fadeIn}>
              <div 
                  className="up-avatar-circle" 
                  style={{ 
                  position: 'relative', 
                  width: '100px',       // අවශ්‍ය ප්‍රමාණය (Width) යොදන්න
                  height: '100px',      // අවශ්‍ය ප්‍රමාණය (Height) යොදන්න
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                  }}
                    >
              <img 
                src='https://img.icons8.com/?size=100&id=bOXN3AZhMCek&format=png&color=000000' 
                alt="profile"
                style={{
                width: '110%', 
                height: '110%', 
                borderRadius: '50%', 
                objectFit: 'cover' 
                }} 
                />
              <div className="up-status-dot"></div>
              </div>
            <div className="up-name-badge">Name</div>
            <div className="up-progress-bar-container">
              <div className="up-progress-bar"></div>
            </div>
          </motion.div>

          {/* User Info Grid */}
          <motion.div className="up-info-grid" variants={staggerContainer}>
            <motion.div className="up-info-card up-card" variants={fadeIn}>
              <div className="up-icon-wrapper">📍</div>
              <h3>Address</h3>
              <p>Colombo, Sri Lanka</p>
            </motion.div>
            <motion.div className="up-info-card up-card" variants={fadeIn}>
              <div className="up-icon-wrapper">🎂</div>
              <h3>Age</h3>
              <p>22 Years</p>
            </motion.div>
            <motion.div className="up-info-card up-card" variants={fadeIn}>
              <div className="up-icon-wrapper">📞</div>
              <h3>WH Number</h3>
              <p>+94 77 123 4567</p>
            </motion.div>
            <motion.div className="up-info-card up-card" variants={fadeIn}>
              <div className="up-icon-wrapper">📱</div>
              <h3>Tel number</h3>
              <p>+94 71 987 6543</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs and Job Section */}
        <motion.div className="up-bottom-section" variants={fadeIn}>
          <div className="up-tabs">
            <button 
              className={activeTab === 'job' ? 'up-tab active' : 'up-tab'} 
              onClick={() => setActiveTab('job')}
            >
              My job
            </button>
            <button 
              className={activeTab === 'history' ? 'up-tab active' : 'up-tab'} 
              onClick={() => setActiveTab('history')}
            >
              My history
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'job' && (
            <motion.div 
              className="up-job-card up-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="up-job-header">
                <div className="up-job-title-group">
                  <div className="up-company-logo">DSI</div>
                  <h2>Naviina DSI Show Room</h2>
                </div>
                <div className="up-capacity-badge">👤 10/50</div>
              </div>

              <h3 className="up-job-role">Packing and delivery</h3>
              
              <div className="up-job-details">
                <span>💰 Rs. 2,000/day</span>
                <span>📍 Colombo</span>
                <span>⏰ 8:00 AM - 5:00 PM</span>
              </div>

              <button className="up-btn-primary">View job →</button>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              className="up-job-card up-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{ color: 'var(--up-text-muted)' }}>No previous history available yet.</p>
            </motion.div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default UserProfile;