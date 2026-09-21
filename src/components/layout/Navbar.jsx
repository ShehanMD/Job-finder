import React, { useState } from "react";
import styles from "./Navbar.module.css";

export const Navbar = ({
  isLoggedIn = false,
  transparent = false,
  onSignInClick,
  onSignOutClick,
  onNavClick
}) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className={`${styles.navbar} ${transparent ? styles.transparent : ""}`}>
      {isLoggedIn && (
        <div
          className={styles.userIcon}
          onClick={() => setShowProfile(!showProfile)}
        >
          👤
        </div>
      )}

      {isLoggedIn && showProfile && (
        <div className={styles.profilePopup}>
          <button
            className={styles.closeProfile}
            onClick={() => setShowProfile(false)}
          >
            ×
          </button>

          <div className={styles.popupTopSection}>
            <div className={styles.profileLeft}>
              <div className={styles.profileImage}>👤</div>
              <div className={styles.nameBadge}>NAME</div>
            </div>

            <div className={styles.userInfoRight}>
              <h4 className={styles.userInfoTitle}>USER INFO</h4>
              <div className={styles.infoRow}>📍 ADDRESS</div>
              <div className={styles.infoRow}>📅 AGE</div>
              <div className={styles.infoRow}>📞 WH NUMBER</div>
              <div className={styles.infoRow}>📱 TEL NUMBER</div>
              <div className={styles.infoRow}>🏠 ADDRESS</div>
            </div>
          </div>

          <div className={styles.sectionHeaderContainer}>
            <span className={styles.sectionLabel}>My job</span>
            <span 
              className={styles.myHistoryLink}
              onClick={() => {
                setShowProfile(false);
                if (onNavClick) onNavClick("history");
              }}
            >
              My History
            </span>
          </div>

          <div className={styles.jobCard}>
            <div className={styles.jobCardTop}>
              <div className={styles.companyInfo}>
                <span className={styles.companyLogo}>DSI</span>
                <span className={styles.companyName}>Naviina DSI Show Room</span>
              </div>
              <span className={styles.applicantsBadge}>👤 10/50</span>
            </div>

            <div className={styles.jobDetails}>
              <h4 className={styles.jobTitle}>Packing and delivery</h4>
              <p className={styles.jobMeta}>💰 Rs. 2,000/day</p>
              <p className={styles.jobMeta}>📍 Colombo</p>
              <p className={styles.jobMeta}>⏰ 8:00 AM - 5:00 PM</p>
            </div>

            <button 
              className={styles.viewJobButton}
              onClick={() => {
                setShowProfile(false);
                if (onNavClick) onNavClick("history");
              }}
            >
              View job
            </button>
          </div>
        </div>
      )}

      <a
        href="/"
        className={styles.navLink}
        onClick={(e) => {
          e.preventDefault();
          if (onNavClick) onNavClick("overview");
        }}
      >
        Home
      </a>

      <a
        href="/about"
        className={styles.navLink}
        onClick={(e) => {
          e.preventDefault();
          if (onNavClick) onNavClick("yourJobs");
        }}
      >
        About
      </a>

      <a
        href="/contact"
        className={styles.navLink}
        onClick={(e) => {
          e.preventDefault();
          if (onNavClick) onNavClick("applications");
        }}
      >
        Contact
      </a>

      {isLoggedIn ? (
        <button className={styles.signInButton} onClick={onSignOutClick}>
          Sign Out
        </button>
      ) : (
        <button className={styles.signInButton} onClick={onSignInClick}>
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Navbar;