import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config/env.js'
const ViewStudents = () => {
  const [loading,setLoading] = useState(true)
  const [students,setStudents] = useState([])
  const navigate = useNavigate()
  const fetchData = async () => {
    try{
      const token = localStorage.getItem('token')
      if(!token) return
      const response = await fetch(`${BASE_URL}/api/v1/admin/students`, {
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
  <div className="min-h-screen px-6 py-8">
    <div
      onClick={() => navigate(-1)}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-all duration-300 text-lg font-medium"
    >
      ← Back
    </div>

    {
      students?.length > 0 ? (
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <p className="text-white text-5xl md:text-6xl font-bold text-center mb-12">
            List of Students
          </p>

          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="max-h-[65vh] overflow-y-auto">
              <table
                className="w-full text-white"
                cellPadding={"10"}
                cellSpacing={"10"}
                border={"1"}
              >
                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-xl">
                  <tr>
                    <th className="py-5 px-6 text-left font-semibold">
                      Name
                    </th>
                    <th className="py-5 px-6 text-left font-semibold">
                      Email ID
                    </th>
                    <th className="py-5 px-6 text-left font-semibold">
                      Books Borrowed
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {
                    students?.map((student, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-t border-white/10 hover:bg-white/5 transition-all duration-300"
                        >
                          <td className="py-4 px-6">
                            {student.name}
                          </td>

                          <td className="py-4 px-6">
                            {student.email}
                          </td>

                          <td className="py-4 px-6">
                            {
                              student.booksBorrowed.length > 0
                                ? student.booksBorrowed.map(book => book.title).join(', ')
                                : 'No books borrowed'
                            }
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-12 py-10 shadow-2xl">
            <p className="text-4xl font-semibold text-center text-white">
              No Students Found.
            </p>
          </div>
        </div>
      )
    }
  </div>
)
}

export default ViewStudents