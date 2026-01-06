import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminSignIn = () => {
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [showErrorBox,setShowErrorBox] = useState(false)
  const validateCredentials = () => {
    const emailTemplate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const passwordTemplate = /^(?=.*[0-9])(?=.*[!@#$.%^&*])(?=.*[a-zA-Z]).{6,}$/;
    if(email == ""){
      setError('Email field is mandatory!')
      return false
    }
    if(password == ""){
      setError('Password field is mandatory!')
      return false
    }
    if(!emailTemplate.test(email)){
      setError('Enter a valid email id!')
      return false
    }
    if(!passwordTemplate.test(password)){
      setError('Enter a valid password (Password must contain atleast 1 special character, 1 digit and must atleast be 6 characters long! )!')
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
      const response = await fetch('http://localhost:5500/api/v1/admin/signin', {
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
        navigate('/admin/dashboard')
      }
    
  }
  return (
    <>
    <div onClick={() => navigate(-1)} className="fixed top-0 left-0 p-4 cursor-pointer hover:text-blue-700 duration-300 transition-all ease-in-out text-white z-50 text-2xl">←Back</div>
      {
        showErrorBox &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border-2 bg-gray-900 border-slate-700 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-y-6">
            <div className="text-white text-xl text-center leading-relaxed">
              {error}
            </div>
            <button 
              onClick={() => setShowErrorBox(false)}
              className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out"
            >
              Got it
            </button>
          </div>
        </div>
      }
      <div className='flex flex-col text-white p-5 justify-center items-center'>
        <div className='text-5xl text-center mb-[100px]'>Admin Login Page</div>
        <form className='flex flex-col items-center justify-center gap-y-10 border-2 w-1/3 rounded-2xl border-gray-900 p-10 hover:translate-y-2 duration-300 ease-in-out transition-all'>
          <input placeholder='Enter your email id..' value={email} type='email' className='text-black rounded-full py-2 px-3 w-full' onChange={e => setEmail(e.target.value)}/>
          <input placeholder='Enter your password..' value={password} type='password' className='text-black rounded-full py-2 px-3 w-full' onChange={e => setPassword(e.target.value)}/>
          <button className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out' onClick={handleSubmit}>Login</button>
        </form>
      </div>
    </>
  )
}

export default AdminSignIn