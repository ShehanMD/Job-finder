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

        {/* Profile Top */}
        <div className="profile-top">

          {/* Profile Image */}
          <div className="profile-left">
            <div className="big-avatar">
              <div className="avatar-head"></div>
              <div className="avatar-body"></div>
            </div>

            <div className="name-label">
              NAME
            </div>

            <div className="profile-line"></div>
          </div>

          {/* User Info */}
          <div className="user-info">

            <h5>USER INFO</h5>

            <div className="info-row">
              📍 ADDRESS
            </div>

            <div className="info-row">
              🎂 AGE
            </div>

            <div className="info-row">
              📞 WH NUMBER
            </div>

            <div className="info-row">
              📱 TEL NUMBER
            </div>

            <div className="info-row">
              🏠 ADDRESS
            </div>

          </div>
        </div>

        {/* History */}
        <div className="history">
          My History
        </div>

        {/* My Job */}
        <div className="job-title">
          My Job
        </div>

        {/* Job Card */}
        <div className="job-card">

          <div className="job-header">

            <div className="company-logo">
              DSI
            </div>

            <div className="company-name">
              Navina DSI Show Room
            </div>

            <div className="applicants">
              👤 10/50
            </div>

          </div>

          <h3>
            Packing and delivery
          </h3>

          <div className="job-details">
            💰 Rs. 2,000/day
            <br />

            📍 Colombo
            <br />

            ⏰ 8:00 AM - 5:00 PM
          </div>

          <div className="job-bottom">
            <button>
              View job
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;