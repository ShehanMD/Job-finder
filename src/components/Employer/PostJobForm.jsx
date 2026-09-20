import React, { useState } from 'react';
import Input from '../Ui/Input';
import Button from '../Ui/Button';
import { MapPin } from 'lucide-react';

// Firebase imports සියල්ලම අයින් කර ඇත

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Backend එකට යවනවා වෙනුවට දත්ත ටික Console එකේ පෙන්වමු
    console.log("----- නව රැකියා දත්ත -----");
    console.log(formData);
    console.log("---------------------------");

    // Loading පෙන්නන්න තත්පර 1ක ප්‍රමාදයක් (delay) දෙමු
    setTimeout(() => {
      alert("රැකියාව සාර්ථකව පළ කරන ලදී! (Backend සම්බන්ධ කර නැත)");
      setLoading(false);
      
      // අදාළ Tab එකට මාරු වීම
      if (onJobPosted) {
        onJobPosted('yourJobs'); 
      }
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full bg-[#1a1a1a] p-8 rounded-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          <span className="text-[#00c49f]">Post</span> a Job
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Job title"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[12px] font-bold text-[#D1D5DB]">Job description</label>
          <textarea
            name="description"
            rows="3"
            className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none text-sm resize-none"
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
          <label className="text-[12px] font-bold text-[#D1D5DB] block mb-1.5">Location</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                name="location"
                className="w-full p-2.5 rounded bg-[#D9D9D9] text-black outline-none text-sm"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="button" variant="primary" className="gap-2 whitespace-nowrap !h-auto py-2.5 px-4">
              <MapPin className="w-4 h-4" />
              Choose Location
            </Button>
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-[#D1D5DB] block mb-2">No. of employees needed</label>
          <div className="flex items-center gap-4">
            <div className="bg-[#2a2a2a] px-4 py-2 rounded text-xl font-bold border border-gray-700">
              {formData.employees}
            </div>
            <input
              type="range"
              name="employees"
              min="1"
              max="50"
              value={formData.employees}
              onChange={handleChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#00c49f]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[12px] font-bold text-[#D1D5DB]">Requirements</label>
          <textarea
            name="requirements"
            rows="3"
            className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none text-sm resize-none"
            value={formData.requirements}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </Button>
      </form>
    </div>
  );
}