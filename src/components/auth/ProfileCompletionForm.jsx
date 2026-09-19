import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import Input from '../Ui/Input';
import Button from '../Ui/Button'; 

export default function ProfileCompletionForm({ role, employerType, formData, handleInputChange, onBack, onSubmit, loading }) {
  
  // File Upload Handling Function
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      handleInputChange({
        target: {
          name: name,
          value: files[0]
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

      <form onSubmit={onSubmit} className="space-y-2">
        
        {/* Name & Username */}
        <Input
          label={employerType === 'company' ? 'Company Name' : 'Full Name'}
          name="fullName"
          placeholder={employerType === 'company' ? 'e.g. ABC Technologies' : 'e.g. John Doe'}
          value={formData.fullName || ''}
          onChange={handleInputChange}
          required
        />

        <Input
          label="User Name"
          name="userName"
          placeholder="e.g. johndoe99"
          value={formData.userName || ''}
          onChange={handleInputChange}
          required
        />

        {/* Date Field */}
        <div>
          <label className="block text-[12px] text-gray-300 font-bold mb-1">
            {employerType === 'company' ? 'Established Date' : 'Birth Day'}
          </label>
          <div className="flex gap-2">
            <div className="w-16">
              <Input name="birthDay" placeholder="DD" maxLength="2" value={formData.birthDay || ''} onChange={handleInputChange} />
            </div>
            <div className="w-16">
              <Input name="birthMonth" placeholder="MM" maxLength="2" value={formData.birthMonth || ''} onChange={handleInputChange} />
            </div>
            <div className="w-24">
              <Input name="birthYear" placeholder="YYYY" maxLength="4" value={formData.birthYear || ''} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[12px] text-gray-300 font-bold mb-1">Address</label>
          <Input name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1 || ''} onChange={handleInputChange} required />
          <Input name="addressLine2" placeholder="Address Line 2" value={formData.addressLine2 || ''} onChange={handleInputChange} />
          <Input name="addressLine3" placeholder="Address Line 3 / City" value={formData.addressLine3 || ''} onChange={handleInputChange} />
        </div>

        {/* 1. SEEKER / INDIVIDUAL FIELDS */}
        {(role === 'seeker' || employerType === 'individual') && (
          <>
            <Input
              label="Mobile Number"
              type="tel"
              name="mobileNo"
              placeholder="07XXXXXXXX"
              value={formData.mobileNo || ''}
              onChange={handleInputChange}
              required
            />

            <Input
              label="National ID (NIC) Number"
              name="idNo"
              placeholder="NIC Number"
              value={formData.idNo || ''}
              onChange={handleInputChange}
              required
            />

            {/* NIC Photo Upload Box */}
            <div className="pt-2">
              <label className="block text-xs text-gray-300 font-bold mb-2">NIC Photo Upload</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Front Photo */}
                <div className="border-2 border-dashed border-[#00c49f]/60 bg-[#2d2d2d] p-3 rounded-lg text-center hover:bg-[#353535] transition">
                  <input type="file" id="idFront" name="idFront" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="idFront" className="cursor-pointer flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-[#00c49f] mb-1" />
                    <span className="text-[11px] font-medium text-gray-200">
                      {formData.idFront ? formData.idFront.name : 'Upload ID Front'}
                    </span>
                  </label>
                </div>

                {/* Back Photo */}
                <div className="border-2 border-dashed border-[#00c49f]/60 bg-[#2d2d2d] p-3 rounded-lg text-center hover:bg-[#353535] transition">
                  <input type="file" id="idBack" name="idBack" accept="image/*" onChange={handleFileChange} className="hidden" />
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

        {/* 2. COMPANY EMPLOYER FIELDS */}
        {role === 'employer' && employerType === 'company' && (
          <>
            <Input
              label="Company Registration Number"
              name="companyRegNo"
              placeholder="e.g. PV 123456"
              value={formData.companyRegNo || ''}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Office Phone"
                type="tel"
                name="officeNo"
                placeholder="011XXXXXXXX"
                value={formData.officeNo || ''}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Mobile Phone"
                type="tel"
                name="mobileNo"
                placeholder="07XXXXXXXX"
                value={formData.mobileNo || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Certificate Upload Box */}
            <div className="pt-2">
              <label className="block text-xs text-gray-300 font-bold mb-1">Registration Certificate Upload</label>
              <div className="border-2 border-dashed border-[#00c49f]/60 bg-[#2d2d2d] p-4 rounded-lg text-center hover:bg-[#353535] transition">
                <input type="file" id="companyCertificate" name="companyCertificate" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
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

        {/* Custom Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            className="flex-1" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Finish Registration'}
          </Button>
          
          <Button 
            type="button" 
            variant="gray" 
            onClick={onBack} 
            className="px-6"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}