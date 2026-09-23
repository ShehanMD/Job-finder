import React, { useState } from 'react';
import Button from '../Ui/Button';
import { MapPin } from 'lucide-react';
import './employer-dashboard.css';

export default function PostJobForm({ onJobPosted }) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    description: '',
    payment: '',
    location: '',
    employees: 50,
    // අලුත් Date State
    jobDateDay: '',
    jobDateMonth: '',
    jobDateYear: '',
    // අලුත් Time State
    startHour: '',
    startMin: '',
    startAmPm: 'AM',
    endHour: '',
    endMin: '',
    endAmPm: 'PM',
    requirements: ''
  });

  const [loading, setLoading] = useState(false);

  // Dropdowns සඳහා අවශ්‍ය දත්ත (Arrays)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2024, 2025, 2026, 2027];
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    if (onJobPosted) {
      onJobPosted('overview');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("----- Hosa Job Data -----");
    console.log(formData);
    console.log("---------------------------");

    setTimeout(() => {
      alert("Job posted successfully!");
      setLoading(false);
      
      if (onJobPosted) {
        onJobPosted('yourJobs');
      }
    }, 1000);
  };

  return (
    <div className="post-job-container">
      <div className="header-container">
        <h2 className="header-title">
          <span className="text-highlight">Post</span> a Job
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        
        <div className="form-group">
          <label className="form-label">Job title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            placeholder="Enter job title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Job description</label>
          <textarea
            name="description"
            rows="3"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter job description"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment</label>
          <input
            type="text"
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            required
            placeholder="e.g., LKR 2500 / day"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <div className="location-wrapper">
            <div className="flex-1">
              <input
                type="text"
                name="location"
                className="location-input"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
              />
            </div>
            <button type="button" className="location-btn">
              <MapPin size={18} />
              Choose Location
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">No. of employees needed</label>
          <div className="employees-wrapper">
            <input
              type="number"
              name="employees"
              min="1"
              max="500"
              value={formData.employees}
              onChange={handleChange}
              className="employees-count-input"
              required
            />
            <input
              type="range"
              name="employees"
              min="1"
              max="100"
              value={formData.employees}
              onChange={handleChange}
              className="employees-range"
            />
          </div>
        </div>

        {/* අලුතින් එක් කළ Custom Date Dropdowns */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <div className="custom-dropdown-group">
            <select name="jobDateDay" value={formData.jobDateDay} onChange={handleChange} className="form-select" required>
              <option value="" disabled>Day</option>
              {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select name="jobDateMonth" value={formData.jobDateMonth} onChange={handleChange} className="form-select" required>
              <option value="" disabled>Month</option>
              {months.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
            <select name="jobDateYear" value={formData.jobDateYear} onChange={handleChange} className="form-select" required>
              <option value="" disabled>Year</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        {/* අලුතින් එක් කළ Custom Time Dropdowns */}
        <div className="time-grid">
          <div className="form-group">
            <label className="form-label">Start time</label>
            <div className="custom-dropdown-group">
              <select name="startHour" value={formData.startHour} onChange={handleChange} className="form-select" required>
                <option value="" disabled>Hr</option>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select name="startMin" value={formData.startMin} onChange={handleChange} className="form-select" required>
                <option value="" disabled>Min</option>
                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="startAmPm" value={formData.startAmPm} onChange={handleChange} className="form-select select-sm" required>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">End time</label>
            <div className="custom-dropdown-group">
              <select name="endHour" value={formData.endHour} onChange={handleChange} className="form-select" required>
                <option value="" disabled>Hr</option>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select name="endMin" value={formData.endMin} onChange={handleChange} className="form-select" required>
                <option value="" disabled>Min</option>
                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="endAmPm" value={formData.endAmPm} onChange={handleChange} className="form-select select-sm" required>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group-last">
          <label className="form-label">Requirements</label>
          <textarea
            name="requirements"
            rows="3"
            className="form-textarea"
            value={formData.requirements}
            onChange={handleChange}
            required
            placeholder="Enter job requirements"
          />
        </div>

        <div className="button-group">
          <Button variant="gray" className="btn-half" onClick={handleBack}>
            Back
          </Button>
          <Button className="btn-half" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}