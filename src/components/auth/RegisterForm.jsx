import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function RegisterForm({ role, employerType, formData, handleInputChange, onNext, onBack }) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Registration</h2>
        <span className="text-xs text-[#00c49f] mt-1 inline-block">
          Registering as: {role === 'seeker' ? 'Job Seeker' : `Employer (${employerType})`}
        </span>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#d9d9d9] text-black rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="flex-1 bg-[#00c49f] text-black font-semibold py-2 rounded hover:bg-[#00a887] transition"
          >
            Register
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-[#00a887] text-black font-semibold py-2 rounded hover:bg-[#008f72] transition"
          >
            Back
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded font-medium text-sm hover:bg-gray-100 transition">
          <FcGoogle className="text-lg" />
          Login with Google
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded font-medium text-sm hover:bg-gray-100 transition">
          <FaFacebook className="text-blue-600 text-lg" />
          Login with Facebook
        </button>
      </div>
    </div>
  );
}