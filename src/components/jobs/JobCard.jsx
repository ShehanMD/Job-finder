import React from 'react';
import styles from './JobCard.module.css';

import { FaUserCircle, FaMoneyBillWave, FaMapMarkerAlt, FaRegClock, FaCircle } from 'react-icons/fa';

export const JobCard = ({ 
  companyName, 
  profilePic, 
  filled, 
  total, 
  isUrgent, 
  title, 
  payment, 
  location, 
  time 
}) => {
  return (
    <div className={styles.card}>

      <div className={styles.header}>
        <div className={styles.companyInfo}>
          <div className={styles.logoContainer}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" className={styles.profilePic} />
            ) : (
              <FaUserCircle size={45} color="#ccc" /> 
            )}
          </div>
          <span className={styles.companyName}>{companyName}</span>
        </div>
        <div className={styles.vacancyInfo}>
          <FaUserCircle size={24} color="#ccc" />
          <span>{filled}/{total}</span>
        </div>
      </div>

   
      {isUrgent && (
        <div className={styles.urgentBadge}>
          <FaCircle className={styles.redDot} /> Urgent
        </div>
      )}

      <h3 className={styles.jobTitle}>{title}</h3>

      <div className={styles.detailsRow}>
        <div className={styles.detailsList}>
          <div className={styles.detailItem}>
            <FaMoneyBillWave /> {payment}
          </div>
          <div className={styles.detailItem}>
            <FaMapMarkerAlt /> {location}
          </div>
          <div className={styles.detailItem}>
            <FaRegClock /> {time}
          </div>
        </div>
        
        <button className={styles.viewBtn}>View job</button>
      </div>
    </div>
  );
};