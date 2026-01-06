import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
const StudentDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [user,setUser] = useState(null)
  const fetchData = async () => {
    try{
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5500/api/v1/student/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const res = await response.json()
      setUser(res.student)
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    
    fetchData()
  },[])
  const handleLogOut = () => {
    localStorage.removeItem('token')
    navigate('/student/signin')
  }
  const navigate = useNavigate()
  if(!localStorage.getItem('token')){
    return (
      <>
      <div className='flex flex-col p-5 items-center gap-y-5'>
        <h1 className='text-white text-5xl font-bold'>Authentication Error!</h1>
        <Link to={"/student/signin"}><h2 className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out'>Authenticate yourself</h2></Link>
      </div>
      </>
    )
  }
  if(loading){
    return(
      <div className="flex flex-col items-center justify-center space-y-2 min-h-screen">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <span className="text-sm font-medium text-white">Loading...</span>
      </div>
    )
  }
  return (
    <>
    
    <div onClick={() => navigate(-1)} className="fixed top-0 left-0 p-4 cursor-pointer hover:text-blue-700 duration-300 transition-all ease-in-out text-white z-50 text-2xl">←Back</div>
     
      <div className='flex flex-col p-5 -items-center justify-center gap-y-10'>
        <div className='flex flex-row justify-center items-center gap-x-5'>
        <div className='text-6xl text-center text-white'>Student Dashboard</div>
        <div className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out' onClick={handleLogOut}>Sign out</div>
        </div>
        <div className='flex flex-row gap-x-10 items-center justify-center'>
          <div className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out' onClick={e => navigate('/student/dashboard/books')}>View available books</div>
          <div className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out' onClick={e => navigate('/student/dashboard/borrowed-books')}>View borrowed books</div>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard