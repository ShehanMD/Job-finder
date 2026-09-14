import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ProfileCompletionForm({ employerType, formData, handleInputChange, onBack, onSubmit }) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">
          <span className="text-[#00c49f]">Complete</span> Your Profile
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">
            {employerType === 'company' ? 'Company Name' : 'Full Name'}
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">User Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

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
              value={formData.birthDay}
              onChange={handleInputChange}
              className="w-16 px-2 py-2 bg-[#d9d9d9] text-black text-center rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
            />
            <input
              type="text"
              name="birthMonth"
              placeholder="MM"
              maxLength="2"
              value={formData.birthMonth}
              onChange={handleInputChange}
              className="w-16 px-2 py-2 bg-[#d9d9d9] text-black text-center rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
            />
            <input
              type="text"
              name="birthYear"
              placeholder="YY"
              maxLength="2"
              value={formData.birthYear}
              onChange={handleInputChange}
              className="w-20 px-2 py-2 bg-[#d9d9d9] text-black text-center rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-[#00c49f] text-black font-semibold py-2 rounded hover:bg-[#00a887] transition"
          >
            Finish Registration
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