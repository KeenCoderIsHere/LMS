import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-6xl font-bold text-white text-center tracking-tight mb-20">
          Library Management System
        </div>

        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Link to={'/admin/signin'}>
              <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl">
                <div className="text-white text-2xl font-semibold text-center">
                  Administration Portal
                </div>
                <p className="text-slate-300 mt-4 text-center">(For Admins)</p>
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <Link to={'/student/signin'}>
              <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl">
                <div className="text-white text-2xl font-semibold text-center">OPAC Portal</div>
                <p className="text-slate-300 mt-4 text-center">(For Borrowing Books)</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
