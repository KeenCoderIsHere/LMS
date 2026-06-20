import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/env.js';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    localStorage.removeItem('token');
    navigate('/admin/signin');
  };
  if (!localStorage.getItem('token')) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-3xl text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              This is a protected route which is accessible by admins only
            </h1>

            <Link to={'/admin/signin'}>
              <h2 className="mt-8 inline-block px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-all duration-300">
                Authenticate yourself
              </h2>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-12">
          <div className="text-5xl md:text-6xl font-bold text-white text-center">
            Admin Dashboard
          </div>

          <div
            onClick={handleLogOut}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer transition-all duration-300"
          >
            Sign out
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 py-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex items-center justify-center shadow-xl hover:-translate-y-2 transition-all duration-300">
            <button
              onClick={() => navigate('/admin/dashboard/view-all-students')}
              className="text-white text-lg font-semibold cursor-pointer"
            >
              View All Students
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex items-center justify-center shadow-xl hover:-translate-y-2 transition-all duration-300">
            <button
              className="text-white text-lg font-semibold cursor-pointer"
              onClick={() => navigate('/admin/dashboard/add-book')}
            >
              Add books
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex items-center justify-center shadow-xl hover:-translate-y-2 transition-all duration-300">
            <button
              onClick={() => navigate('/admin/dashboard/view-all-books')}
              className="text-white text-lg font-semibold cursor-pointer"
            >
              View All Books
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex items-center justify-center shadow-xl hover:-translate-y-2 transition-all duration-300">
            <button
              onClick={() => navigate('/admin/dashboard/view-all-records')}
              className="text-white text-lg font-semibold cursor-pointer"
            >
              View All Records
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
