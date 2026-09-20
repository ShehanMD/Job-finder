import React, { useState } from 'react';
import { User, X, Star } from 'lucide-react';
import Button from '../Ui/Button';
import './employer-dashboard.css';

export default function ApplicantCenter({ jobId, onClose }) {
  // රූපයේ දැක්වෙන දත්ත (Mock Data)
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
      <h2 className="app-center-title">Welcome To Application Center</h2>

      <div className="app-card">
        {/* රූපයේ ඇති රතු පැහැති කතිරය */}
        {!selectedApplicant && (
          <button className="close-btn-top" onClick={onClose}>
            <X size={40} strokeWidth={4} />
          </button>
        )}

        {/* ලැයිස්තුව පෙන්වීම */}
        {!selectedApplicant ? (
          <div className="applicant-list">
            {applicants.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'white', marginTop: '2rem' }}>
                No applicants found.
              </div>
            ) : (
              applicants.map((app) => (
                <div 
                  key={app.id} 
                  className="applicant-row"
                  onClick={() => setSelectedApplicant(app)}
                >
                  <div className="app-avatar-wrapper">
                    <User size={32} />
                  </div>
                  <div className="app-row-details">
                    <span className="app-text-green">{app.username}</span>
                    <span className="app-text-green">{app.jobTitle}</span>
                    <span className="app-text-green">{app.date}</span>
                    <span className="app-text-green">{app.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* තෝරාගත් අයගේ විස්තර පෙන්වීම */
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
                <User size={64} color="#4b5563" />
              </div>
              <span className="profile-username">{selectedApplicant.username}</span>
              <span className="profile-rating">
                <Star fill="currentColor" size={20} /> {selectedApplicant.rating}
              </span>
              
              <div className="action-buttons">
                <Button 
                  variant="red" 
                  onClick={() => handleReject(selectedApplicant.id)}
                  style={{ borderRadius: '0.5rem', padding: '0.5rem 2rem' }}
                >
                  Reject
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => handleAccept(selectedApplicant.id)}
                  style={{ borderRadius: '0.5rem', padding: '0.5rem 2rem' }}
                >
                  Accept
                </Button>
              </div>

              <button 
                onClick={() => setSelectedApplicant(null)}
                className="back-to-list-btn"
              >
                ← Back to List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}