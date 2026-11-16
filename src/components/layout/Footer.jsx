import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#181818] py-6 text-center text-gray-400 text-sm border-t border-gray-800 mt-auto">
      <p>&copy; {new Date().getFullYear()} Job Finder. All rights reserved.</p>
    </footer>
  );
}