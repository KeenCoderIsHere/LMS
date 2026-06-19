import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config/env.js'
const StudentSignUp = () => {
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const [error,setError] = useState('')
  const navigate = useNavigate()
  const handleNavigateLogin = () => {
    navigate('/student/signin')
  }
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
        setError('Enter a valid password!')
        return false
      }
      if(password !== confirmPassword){
        setError('Passwords should be the same in both fields!')
        return false
      }
      if(name === "" || name.trim().length === 0){
        setError('Name field is mandatory!')
        return false
      }
      return true
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if(!validateCredentials()){
      return
    }
    const response = await fetch(`${BASE_URL}/api/v1/student/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: confirmPassword
      })
    })
    const res = await response.json()
    if(!res.success){
      setError(res.message)
    }
    else{
      alert('Account successfully created!')
      navigate('/student/signin')
    }
  }
  return (
    <>
  <div
    onClick={() => navigate(-1)}
    className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-all duration-300 text-lg font-medium"
  >
    ← Back
  </div>

  <div className="min-h-screen flex items-center justify-center px-6">
    <div className="w-full max-w-md">
      <div className="text-5xl font-bold text-white text-center mb-12">
        Student Sign Up Page
      </div>

      <form className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col gap-6">
        <input
          placeholder="Enter your name.."
          required
          type="email"
          className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          onChange={e => setName(e.target.value)}
          value={name}
        />

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

        <input
          placeholder="Confirm password.."
          type="password"
          autoComplete="current-password webauthn"
          className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          onChange={e => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl cursor-pointer transition-all duration-300"
          onClick={handleSubmit}
        >
          Signup
        </button>

        <p
          className="text-center text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300"
          onClick={e => handleNavigateLogin()}
        >
          Already have an account? Login.
        </p>

        {
          error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
              <p className="text-red-400 text-center font-medium">
                {error}
              </p>
            </div>
          )
        }
      </form>
    </div>
  </div>
</>
  )
}

export default StudentSignUp