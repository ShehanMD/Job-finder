import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { JobCard } from '../components/jobs/JobCard';

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white flex flex-col justify-between bg-cover bg-center bg-fixed relative">
        <Navbar />
        <main className="flex-grow">
            <JobCard />
        </main>
        <Footer />
    </div>
  );
}