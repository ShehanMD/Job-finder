import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

import Button from '../Ui/Button';
import Input from '../Ui/Input';   

export default function RegisterForm({ role, employerType, formData, handleInputChange, onNext, onBack}) {

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

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder={"Confirm your password"}
          value={formData.confirmPassword || ''}
          onChange={handleInputChange}
          required
        />

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
        <Button type="button" variant="white" className="w-full gap-2">
          <FcGoogle className="text-lg" />
          Login with Google
        </Button>
        
        <Button type="button" variant="white" className="w-full gap-2">
          <FaFacebook className="text-blue-600 text-lg" />
          Login with Facebook
        </Button>
      </div>
    </div>
  );
}