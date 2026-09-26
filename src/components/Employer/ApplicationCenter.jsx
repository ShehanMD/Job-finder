import React, { useState } from 'react';
import { User, X, Star, ArrowLeft } from 'lucide-react';
import Button from '../Ui/Button';
import './employer-dashboard.css';

export default function ApplicationCenter({ jobId, onClose }) {
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      username: 'Nishan723',
      jobTitle: 'Navinna DSI Warehouse',
      date: '19/06',
      time: '11.25',
      fullName: 'Ponsuge Velvet Shrek',
      idNumber: '20052558655565',
      contactNumber: '075 2356475',
      whatsappNumber: '075 2356475',
      address: 'Mathalana, Kirindiwela',
      rating: '3.2/5.0'
    },
    {
      id: 2,
      username: 'Amal123',
      jobTitle: 'Navinna DSI Warehouse',
      date: '19/06',
      time: '12.40',
      fullName: 'Amal Silva',
      idNumber: '199815605512',
      contactNumber: '077 123 4567',
      whatsappNumber: '077 123 4567',
      address: 'Colombo 07',
      rating: '4.5/5.0'
    },
    {
      id: 3,
      username: 'Bimal908',
      jobTitle: 'Navinna DSI Warehouse',
      date: '19/06',
      time: '13.25',
      fullName: 'Bimal Fernando',
      idNumber: '199515605599',
      contactNumber: '071 987 6543',
      whatsappNumber: '071 987 6543',
      address: 'Kandy, Sri Lanka',
      rating: '4.0/5.0'
    }
  ]);

  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleAccept = (id) => {
    alert("Added to available group");
    setApplicants(applicants.filter(app => app.id !== id));
    setSelectedApplicant(null);
  };

  const handleReject = (id) => {
    setApplicants(applicants.filter(app => app.id !== id));
    setSelectedApplicant(null);
  };

  return (
    <div className="app-center-wrapper">
      <div className="app-card">
        
        <div className="app-center-header">
          <h2 className="app-center-title">
            Application <span>Center</span>
          </h2>
          {!selectedApplicant && (
            <button className="close-btn-top" onClick={onClose} title="Close">
              <X size={24} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {!selectedApplicant ? (
          <div className="applicant-list">
            {applicants.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '3rem' }}>
                No applicants found for this job.
              </div>
            ) : (
              applicants.map((app) => (
                <div 
                  key={app.id} 
                  className="applicant-row"
                  onClick={() => setSelectedApplicant(app)}
                >
                  <div className="app-avatar-wrapper">
                    <User size={20} />
                  </div>
                  <div className="app-row-details">
                    <span className="app-name-text">{app.username}</span>
                    <span className="app-job-text">{app.jobTitle}</span>
                    <span className="app-date-text">
                      {app.date} • {app.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="detail-container">
            <div className="detail-left">
              <div className="info-group">
                <span className="info-label">Full Name</span>
                <div className="info-box">{selectedApplicant.fullName}</div>
              </div>
              <div className="info-group">
                <span className="info-label">ID Number</span>
                <div className="info-box">{selectedApplicant.idNumber}</div>
              </div>
              <div className="info-group">
                <span className="info-label">Contact Number</span>
                <div className="info-box">{selectedApplicant.contactNumber}</div>
              </div>
              <div className="info-group">
                <span className="info-label">WhatsApp Number</span>
                <div className="info-box">{selectedApplicant.whatsappNumber}</div>
              </div>
              <div className="info-group">
                <span className="info-label">Address</span>
                <div className="info-box">{selectedApplicant.address}</div>
              </div>
            </div>

            <div className="detail-right">
              <div className="profile-avatar-large">
                <User size={40} />
              </div>
              <span className="profile-username">{selectedApplicant.username}</span>
              <span className="profile-rating">
                <Star fill="currentColor" size={16} /> {selectedApplicant.rating}
              </span>
              
              <div className="action-buttons">
                {/* Reject Button - Outline style to make it look professional */}
                <Button 
                  onClick={() => handleReject(selectedApplicant.id)}
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#ef4444', 
                    border: '1px solid #ef4444',
                    borderRadius: '0.5rem', 
                    padding: '0.625rem 1.5rem', 
                    flex: 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)' }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent' }}
                >
                  Reject
                </Button>

                {/* Accept Button - Solid Primary Style */}
                <Button 
                  onClick={() => handleAccept(selectedApplicant.id)}
                  style={{ 
                    backgroundColor: '#00c49f', 
                    color: '#121212', 
                    border: '1px solid #00c49f',
                    borderRadius: '0.5rem', 
                    padding: '0.625rem 1.5rem', 
                    flex: 1,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0, 196, 159, 0.2)'
                  }}
                >
                  Accept
                </Button>
              </div>

              <button 
                onClick={() => setSelectedApplicant(null)}
                className="back-to-list-btn"
              >
                <ArrowLeft size={16} /> Back to List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}