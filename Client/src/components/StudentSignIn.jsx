import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config/env.js'
const StudentSignIn = () => {
    const navigate = useNavigate()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const [showErrorBox,setShowErrorBox] = useState(false)
    const validateCredentials = () => {
      const emailTemplate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const passwordTemplate = /^(?=.*[0-9])(?=.*[!@#$.%^&*])(?=.*[a-zA-Z]).{6,}$/;
      if(email === ""){
        setError('Email field is mandatory!')
        return false
      }
      if(password === ""){
        setError('Password field is mandatory!')
        return false
      }
      if(!emailTemplate.test(email)){
        setError('Enter a valid email id!')
        return false
      }
      if(!passwordTemplate.test(password)){
        setError('Enter a valid password (Password must contain atleast 1 special character, 1 digit and must atleast be 6 characters long!')
        return false
      }
      return true
    }
    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
      if(!validateCredentials()){
        setShowErrorBox(true)
        return
      }
        const response = await fetch(`${BASE_URL}/api/v1/student/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        })
        const res = await response.json()
        if(!res.success){
          setError(res.message)
          setShowErrorBox(true)
        }
        else{
          localStorage.setItem('token', res.data.token)
          navigate('/student/dashboard')
        }
    }
  const handleNavigateSignUp = () => {
    navigate('/student/signup')
  }
  return (
  <>
    {
      showErrorBox &&
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-8">
          <div className="text-white text-lg text-center leading-relaxed">
            {error}
          </div>

          <button
            onClick={() => setShowErrorBox(false)}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-all duration-300"
          >
            Got it
          </button>
        </div>
      </div>
    }

    <div
      onClick={() => navigate(-1)}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-all duration-300 text-lg font-medium"
    >
      ← Back
    </div>

    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-5xl font-bold text-white text-center mb-12">
          Student Login Page
        </div>

        <form className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col gap-6">
          <input
            placeholder="Enter your email id.."
            type="email"
            className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />

          <input
            placeholder="Enter your password.."
            type="password"
            autoComplete="current-password webauthn"
            className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl cursor-pointer transition-all duration-300"
            onClick={handleSubmit}
          >
            Login
          </button>

          <p
            className="text-center text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
            onClick={handleNavigateSignUp}
          >
            Don't have an account? Sign up.
          </p>
        </form>
      </div>
    </div>
  </>
)
}

export default StudentSignIn