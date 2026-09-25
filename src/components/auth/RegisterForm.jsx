import React from 'react';

import { FaFacebook } from 'react-icons/fa';

import GoogleLogin from "../firebase/GoogleLoginBT";



export default function RegisterForm({ role, employerType, formData, handleInputChange, onNext, onBack }) {


  const PassSame=formData.password == formData.confirmPassword

  return (
    <div>


      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Registration</h2>
        <span className="text-xs text-[#00c49f] mt-1 inline-block">
          Registering as: {role === 'seeker' ? 'Job Seeker' : `Employer (${employerType})`}
        </span>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
        
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder={"Enter your email"}
          value={formData.email || ''}
          onChange={handleInputChange}
          required
          
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder={"Enter your password"}
          value={formData.password || ''}
          onChange={handleInputChange}
          required
        />

        <div>
          <label className="block text-xs text-gray-300 font-semibold mb-1">Confirm Password</label>
          <input 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 bg-[#d9d9d9] text-black rounded focus:outline-none focus:ring-2 focus:ring-[#00c49f]` + (PassSame?' ':' ErrorINPIUT')}
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="submit" variant="primary" className="flex-1">
            Register
          </Button>
          <Button type="button" variant="gray" onClick={onBack} className="flex-1">
            Back
          </Button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        <GoogleLogin />
        <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded font-medium text-sm hover:bg-gray-100 transition">
          <FaFacebook className="text-blue-600 text-lg" />
          Login with Facebook
        </button>











      </div>
    </div>
  );
}