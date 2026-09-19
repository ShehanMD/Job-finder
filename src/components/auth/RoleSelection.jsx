import React from 'react';
import { User, Building2 } from 'lucide-react';
import Button from '../Ui/Button';

export default function RoleSelection({ role, setRole, onSelectSeeker, onSelectEmployerType }) {
  return (
    <div className="flex flex-col items-center gap-4" >
      {!role && (
        <div className="flex flex-wrap justify-center gap-4 my-10">
          <Button
            variant="primary"
            onClick={() => setRole('employer')}
            className="text-black shadow-lg px-6"
          >
            I'm an Employer
          </Button>
          
          <Button
            variant="primary"
            onClick={onSelectSeeker}
            className="text-black shadow-lg px-6"
          >
            I'm a Job Seeker
          </Button>
        </div>
      )}

      {role === 'employer' && (
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#00c49f] max-w-md w-full shadow-2xl">
          <h3 className="text-lg font-semibold mb-4 text-[#00c49f]">
            Select Employer Type
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Standard buttons used here because they act as large square layout cards, 
                which conflicts with the fixed 'h-12' of the custom Button component */}
            <button
              onClick={() => onSelectEmployerType('individual')}
              className="flex flex-col items-center justify-center p-4 border border-gray-600 rounded-lg hover:border-[#00c49f] hover:bg-[#333] transition group"
            >
              <User className="w-8 h-8 mb-2 text-gray-400 group-hover:text-[#00c49f]" />
              <span className="font-medium text-sm">Individual</span>
            </button>
            
            <button
              onClick={() => onSelectEmployerType('company')}
              className="flex flex-col items-center justify-center p-4 border border-gray-600 rounded-lg hover:border-[#00c49f] hover:bg-[#333] transition group"
            >
              <Building2 className="w-8 h-8 mb-2 text-gray-400 group-hover:text-[#00c49f]" />
              <span className="font-medium text-sm">Company</span>
            </button>
          </div>

          {/* Standard button used here because it is a simple text link */}
          <button
            onClick={() => setRole(null)}
            className="mt-4 text-xs text-gray-400 underline hover:text-white"
          >
            Change Role
          </button>
        </div>
      )}
    </div>
  );
}