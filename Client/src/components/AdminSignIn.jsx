import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/env.js';
const AdminSignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showErrorBox, setShowErrorBox] = useState(false);
  const validateCredentials = () => {
    const emailTemplate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordTemplate = /^(?=.*[0-9])(?=.*[!@#$.%^&*])(?=.*[a-zA-Z]).{6,}$/;
    if (email == '') {
      setError('Email field is mandatory!');
      return false;
    }
    if (password == '') {
      setError('Password field is mandatory!');
      return false;
    }
    if (!emailTemplate.test(email)) {
      setError('Enter a valid email id!');
      return false;
    }
    if (!passwordTemplate.test(password)) {
      setError(
        'Enter a valid password (Password must contain atleast 1 special character, 1 digit and must atleast be 6 characters long! )!'
      );
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateCredentials()) {
      setShowErrorBox(true);
      return;
    }
    const response = await fetch(`${BASE_URL}/api/v1/admin/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const res = await response.json();
    if (!res.success) {
      setError(res.message);
      setShowErrorBox(true);
    } else {
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    }
  };
  return (
    <>
      <div
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-all duration-300 text-lg font-medium"
      >
        ← Back
      </div>

      {showErrorBox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900/95 border border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-8">
            <div className="text-white text-lg text-center leading-relaxed">{error}</div>

            <button
              onClick={() => setShowErrorBox(false)}
              className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-white text-5xl md:text-6xl font-bold text-center tracking-tight mb-16">
          Admin Login Page
        </div>

        <form className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex flex-col gap-6 shadow-2xl">
          <input
            placeholder="Enter your email id.."
            value={email}
            type="email"
            className="w-full bg-white/90 text-black rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Enter your password.."
            value={password}
            type="password"
            className="w-full bg-white/90 text-black rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl cursor-pointer transition-all duration-300"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminSignIn;
