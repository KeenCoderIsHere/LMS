import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    const response = await fetch('http://localhost:5500/api/v1/student/signup', {
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
    <div onClick={() => navigate(-1)} className="fixed top-0 left-0 p-4 cursor-pointer hover:text-blue-700 duration-300 transition-all ease-in-out text-white z-50 text-2xl">←Back</div>
      
      <div className='flex flex-col text-white p-5 justify-center items-center'>
          <div className='text-5xl text-center mb-[100px]'>Student Sign Up Page</div>
          <form className='flex flex-col items-center justify-center gap-y-10 border-2 w-1/3 rounded-2xl border-gray-900 p-10 hover:translate-y-2 duration-300 ease-in-out transition-all'>
            <input placeholder='Enter your name..' required type='email' className='rounded-full py-2 px-3 w-full text-black' onChange={e => setName(e.target.value)} value={name}/>
            <input placeholder='Enter your email id..' type='email' className='rounded-full py-2 px-3 w-full text-black' onChange={e => setEmail(e.target.value)} value={email}/>
            <input placeholder='Enter your password..' type='password' autoComplete='current-password webauthn' className='rounded-full py-2 px-3 w-full text-black' onChange={e => setPassword(e.target.value)} value={password}/>
            <input placeholder='Confirm password..' type='password' autoComplete='current-password webauthn' className='rounded-full py-2 px-3 w-full text-black' onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}/>
            <button className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out' onClick={handleSubmit}>Signup</button>
            <p className='text-blue-500 cursor-pointer hover:text-blue-600 duration-200 transition-all ease-in-out' onClick={e => handleNavigateLogin()}>Already have an account? Login.</p>
            {
              error && <p className='text-red-900 bold text-center'>{error}</p>
            }
          </form>
      </div>
    </>
  )
}

export default StudentSignUp