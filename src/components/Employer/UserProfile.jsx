import React from "react";
import "./UserProfile.css";

const UserProfile = ({ onClose }) => {
  return (
    <div className="profile-overlay" onClick={onClose}>
      <div
        className="profile-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Glow blobs (decorative background) */}
        <div className="glow glow-purple"></div>
        <div className="glow glow-teal"></div>
        <div className="glow glow-gold"></div>

        {/* Profile Top */}
        <div className="profile-top">

          {/* Profile Image */}
          <div className="profile-left">
            <div className="big-avatar">
              <span className="avatar-ear avatar-ear-left"></span>
              <span className="avatar-ear avatar-ear-right"></span>
              <div className="avatar-head"></div>
              <div className="avatar-body"></div>
              <span className="status-dot"></span>
            </div>

            <div className="name-label">
             වෙල්වට් pnny
            </div>

            <div className="profile-line">
              <div className="profile-line-fill"></div>
            </div>
          </div>

          {/* User Info */}
          <div className="user-info">

            <h5>User info</h5>

            <div className="info-row">
              <span className="info-icon">📍</span> Address
            </div>

            <div className="info-row">
              <span className="info-icon">🎂</span> Age
            </div>

            <div className="info-row">
              <span className="info-icon">📞</span> WH number
            </div>

            <div className="info-row">
              <span className="info-icon">📱</span> Tel number
            </div>

            <div className="info-row">
              <span className="info-icon">🏠</span> Address
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-row">
          <div className="tab tab-active">My job</div>
          <div className="tab">My history</div>
        </div>

        {/* Job Card */}
        <div className="job-card">

          <div className="job-header">

            <div className="company-logo">
              DSI
            </div>

            <div className="company-name">
              Naviina DSI Show Room
            </div>

            <div className="applicants">
              👤 10/50
            </div>

          </div>

          <h3>
            Packing and delivery
          </h3>

          <div className="job-details">
            <div className="job-detail-row">💰 Rs. 2,000/day</div>
            <div className="job-detail-row">📍 Colombo</div>
            <div className="job-detail-row">⏰ 8:00 AM - 5:00 PM</div>
          </div>

          <div className="job-bottom">
            <button>
              View job →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
