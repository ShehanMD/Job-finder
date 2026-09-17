import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';

export default function ProfileCompletionForm({ role, employerType, formData, handleInputChange, onBack, onSubmit, loading }) {
  
  // File Upload වෙන වෙනම Handling Function එක
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      handleInputChange({
        target: {
          name: name,
          value: files[0] // State එකට File Object එක Save වීම
        }
      });
    }
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar text-left">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          <span className="text-[#00c49f]">Complete</span> Your Profile
        </h2>
        <span className="inline-block mt-2 px-3 py-1 bg-[#333] border border-[#00c49f]/40 text-[#00c49f] text-xs font-semibold rounded-full">
          {role === 'seeker' 
            ? 'Job Seeker Profile' 
            : employerType === 'individual' 
            ? 'Individual Employer Profile' 
            : 'Company Employer Profile'}
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        
        {/* Name & Username */}
        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">
            {employerType === 'company' ? 'Company Name' : 'Full Name'}
          </label>
          <input
            type="text"
            name="fullName"
            placeholder={employerType === 'company' ? 'e.g. ABC Technologies' : 'e.g. John Doe'}
            value={formData.fullName || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">User Name</label>
          <input
            type="text"
            name="userName"
            placeholder="e.g. johndoe99"
            value={formData.userName || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

        {/* Date Field */}
        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">
            {employerType === 'company' ? 'Established Date' : 'Birth Day'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="birthDay"
              placeholder="DD"
              maxLength="2"
              value={formData.birthDay || ''}
              onChange={handleInputChange}
              className="w-16 px-2 py-2 bg-[#d9d9d9] text-black text-center rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
            />
            <input
              type="text"
              name="birthMonth"
              placeholder="MM"
              maxLength="2"
              value={formData.birthMonth || ''}
              onChange={handleInputChange}
              className="w-16 px-2 py-2 bg-[#d9d9d9] text-black text-center rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
            />
            <input
              type="text"
              name="birthYear"
              placeholder="YYYY"
              maxLength="4"
              value={formData.birthYear || ''}
              onChange={handleInputChange}
              className="w-24 px-2 py-2 bg-[#d9d9d9] text-black text-center rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
            />
          </div>
        </div>

        {/* Address Lines (සියල්ලන්ටම පොදුයි) */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-300 font-semibold">Address</label>
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={formData.addressLine1 || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            value={formData.addressLine2 || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
          <input
            type="text"
            name="addressLine3"
            placeholder="Address Line 3 / City"
            value={formData.addressLine3 || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

        {/* ==================== 1. JOB SEEKER / INDIVIDUAL EMPLOYER FIELDS ==================== */}
        {(role === 'seeker' || employerType === 'individual') && (
          <>
            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1">Mobile Number</label>
              <input
                type="tel"
                name="mobileNo"
                placeholder="07XXXXXXXX"
                value={formData.mobileNo || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1">National ID (NIC) Number</label>
              <input
                type="text"
                name="idNo"
                placeholder="NIC Number"
                value={formData.idNo || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
              />
            </div>

            {/* NIC Photo Upload Box (Front & Back) */}
            <div className="pt-2">
              <label className="block text-xs text-gray-300 font-semibold mb-2">NIC Photo Upload</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Front Photo */}
                <div className="border-2 border-dashed border-[#00c49f]/60 bg-[#2d2d2d] p-3 rounded-lg text-center hover:bg-[#353535] transition">
                  <input
                    type="file"
                    id="idFront"
                    name="idFront"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="idFront" className="cursor-pointer flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-[#00c49f] mb-1" />
                    <span className="text-[11px] font-medium text-gray-200">
                      {formData.idFront ? formData.idFront.name : 'Upload ID Front'}
                    </span>
                  </label>
                </div>

                {/* Back Photo */}
                <div className="border-2 border-dashed border-[#00c49f]/60 bg-[#2d2d2d] p-3 rounded-lg text-center hover:bg-[#353535] transition">
                  <input
                    type="file"
                    id="idBack"
                    name="idBack"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="idBack" className="cursor-pointer flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-[#00c49f] mb-1" />
                    <span className="text-[11px] font-medium text-gray-200">
                      {formData.idBack ? formData.idBack.name : 'Upload ID Back'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== 2. COMPANY EMPLOYER FIELDS ==================== */}
        {role === 'employer' && employerType === 'company' && (
          <>
            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1">Company Registration Number</label>
              <input
                type="text"
                name="companyRegNo"
                placeholder="e.g. PV 123456"
                value={formData.companyRegNo || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
              />
            </div>

            {/* Office & Mobile Phones */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1">Office Phone</label>
                <input
                  type="tel"
                  name="officeNo"
                  placeholder="011XXXXXXXX"
                  value={formData.officeNo || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  name="mobileNo"
                  placeholder="07XXXXXXXX"
                  value={formData.mobileNo || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-[#d9d9d9] text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
                />
              </div>
            </div>

            {/* Certificate Upload Box */}
            <div className="pt-2">
              <label className="block text-xs text-gray-300 font-semibold mb-1">Registration Certificate Upload</label>
              <div className="border-2 border-dashed border-[#00c49f]/60 bg-[#2d2d2d] p-4 rounded-lg text-center hover:bg-[#353535] transition">
                <input
                  type="file"
                  id="companyCertificate"
                  name="companyCertificate"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="companyCertificate" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="w-7 h-7 text-[#00c49f] mb-1" />
                  <span className="text-xs font-medium text-gray-200">
                    {formData.companyCertificate ? formData.companyCertificate.name : 'Click to Upload Registration Certificate'}
                  </span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#00c49f] text-black font-semibold py-2 rounded hover:bg-[#00a887] transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Finish Registration'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}