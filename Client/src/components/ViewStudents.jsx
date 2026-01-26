import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ViewStudents = () => {
  const [loading,setLoading] = useState(true)
  const [students,setStudents] = useState([])
  const navigate = useNavigate()
  const fetchData = async () => {
    try{
      const token = localStorage.getItem('token')
      if(!token) return
      const response = await fetch('http://localhost:5500/api/v1/admin/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const res = await response.json()
      if(!response.ok){
        throw new Error(`HTTP Error! Response status: ${response.status}`)
      }
      setStudents(res?.students || [])
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
  if(loading){
      return(
        <div className="flex flex-col items-center justify-center space-y-2 min-h-screen">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <span className="text-sm font-medium text-white">Loading...</span>
        </div>
      )
  }
  return (
    
    <div>
      <div onClick={() => navigate(-1)} className="fixed top-0 left-0 p-4 cursor-pointer hover:text-blue-700 duration-300 transition-all ease-in-out text-white z-50 text-2xl">←Back</div>
      {
        students?.length > 0 ? (
          <div className='p-5 flex flex-col items-center justify-center'>
            <p className='text-white text-6xl text-center'>List of Students</p>
            <div className='max-h-[65vh] overflow-y-auto'>
                <table className='border-2 border-white mt-10 border-collapse' cellPadding={"10"} cellSpacing={"10"} border={"1"}>
                <thead className='text-white'>
                  <tr>
                    <th>Name</th>
                    <th>Email ID</th>
                    <th>Books Borrowed</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    students?.map((student,index) => {
                      return (
                        <tr key={index} className='text-white border-2 text-center'>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.booksBorrowed.length > 0 ? student.booksBorrowed.join(', ') : 'No books borrowed'}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
            
          </div>
        ) : (
          <div className='flex flex-col p-5 justify-center items-center'>
            <p className='text-4xl text-center text-white'>No Students Found.</p>
          </div>
        )
      }
    </div>
  )
}

export default ViewStudents