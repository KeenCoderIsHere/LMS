import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [clickedBooks,setClickedBooks] = useState(false)
  const [loading,setLoading] = useState(true)
  const handleLogOut = async () => {
    localStorage.removeItem('token')
    navigate('/admin/signin')
  }
  const fetchData = async () => {
      try{
        const token = localStorage.getItem('token')
      }
      catch(error){
        console.error(error)
      }
      finally{
        setLoading(false)
      }
    }
    
  useEffect(() => {
    fetchData()
  },[])
  if(!localStorage.getItem('token')){
    return (
      <>
        <div className='flex flex-col p-5 items-center gap-y-5'>
          <h1 className='text-white text-5xl font-bold'>This is a protected route which is accessible by admins only</h1>
          <Link to={"/admin/signin"}><h2 className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out'>Authenticate yourself</h2></Link>
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
      <div className='flex flex-row justify-center items-center'>
        <div className='p-5 text-6xl my-10 text-white text-center'>Admin Dashboard</div>
        <div onClick={handleLogOut} className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out'>Sign out</div>
      </div>
      <div className='flex flex-row justify-center p-5 flex-wrap items-center gap-x-10'>
        <div className='flex flex-col items-center mt-20'>
          <button onClick={e => navigate('/admin/dashboard/view-all-students')} className={`text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`}>View All Students</button>
        </div>
        <div className='flex flex-col mt-20 items-center'>
          <button className={`text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`}
            onClick={e => navigate('/admin/dashboard/add-book')}>Add books</button>
        </div>
        <div className='flex flex-col items-center mt-20'>
          <button onClick={e => navigate('/admin/dashboard/view-all-books')} className={`text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`}>View All Books</button>
        </div>
        <div className='flex flex-col items-center mt-20'>
          <button onClick={e => navigate('/admin/dashboard/view-all-records')} className={`text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`}>View All Records</button>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard