import React, { useState } from 'react';
import Input from '../Ui/Input';
import Button from '../Ui/Button';
import { MapPin } from 'lucide-react';

// CSS ගොනුව සම්බන්ධ කිරීම
import './employer-dashboard.css'; 

export default function PostJobForm({ onJobPosted }) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    description: '',
    payment: '',
    location: '',
    employees: 5,
    startTime: '',
    endTime: '',
    requirements: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Welcome Name පිටුවට යාම සඳහා Back Function එක
  const handleBack = () => {
    if (onJobPosted) {
      onJobPosted('overview'); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("----- නව රැකියා දත්ත -----");
    console.log(formData);
    console.log("---------------------------");

    setTimeout(() => {
      alert("රැකියාව සාර්ථකව පළ කරන ලදී! (Backend සම්බන්ධ කර නැත)");
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
        <Input
          label="Job title"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          required
        />

        <div className="form-group">
          <label className="form-label">Job description</label>
          <textarea
            name="description"
            rows="3"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Payment"
          name="payment"
          value={formData.payment}
          onChange={handleChange}
          required
        />

        <div>
          <label className="form-label block-label">Location</label>
          <div className="location-wrapper">
            <div className="flex-1">
              <input
                type="text"
                name="location"
                className="location-input"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="button" variant="primary" className="location-btn">
              <MapPin size={16} />
              Choose Location
            </Button>
          </div>
        </div>

        <div>
          <label className="form-label block-label-lg">No. of employees needed</label>
          <div className="employees-wrapper">
            <div className="employees-count">
              {formData.employees}
            </div>
            <input
              type="range"
              name="employees"
              min="1"
              max="50"
              value={formData.employees}
              onChange={handleChange}
              className="employees-range"
            />
          </div>
        </div>

        <div className="time-grid">
          <Input
            label="Start time"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
          <Input
            label="End time"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
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
          />
        </div>

        {/* Back සහ Post Job බොත්තම් දෙක එක පෙළට */}
        <div className="button-group">
          <Button type="button" variant="gray" className="btn-half" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" className="btn-half" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}