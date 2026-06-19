import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../config/env.js'
const StudentDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [user,setUser] = useState(null)
  const fetchData = async () => {
    try{
      const token = localStorage.getItem('token')
      const response = await fetch(`${BASE_URL}/api/v1/student/me`, {
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
  if (!localStorage.getItem('token')) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">
            Authentication Error!
          </h1>

          <Link to={"/student/signin"}>
            <h2 className="inline-flex items-center justify-center px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-all duration-300">
              Authenticate yourself
            </h2>
          </Link>
        </div>
      </div>
    </>
  )
}

if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
      <span className="text-white text-lg font-medium">
        Loading...
      </span>
    </div>
  )
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
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
          <div className="text-5xl md:text-6xl font-bold text-center text-white">
            Student Dashboard
          </div>

          <div
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer transition-all duration-300"
            onClick={handleLogOut}
          >
            Sign out
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex items-center justify-center"
            onClick={e => navigate('/student/dashboard/books')}
          >
            <div className="text-white text-2xl font-semibold text-center">
              View available books
            </div>
          </div>

          <div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex items-center justify-center"
            onClick={e => navigate('/student/dashboard/borrowed-books')}
          >
            <div className="text-white text-2xl font-semibold text-center">
              View borrowed books
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)
}

export default StudentDashboard