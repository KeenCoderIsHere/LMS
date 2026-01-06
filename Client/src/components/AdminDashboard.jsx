import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [dataStudents,setDataStudents] = useState([])
  const [records,setRecords] = useState([])
  const [clickedStudents,setClickedStudents] = useState(false)
  const [clickedRecords,setClickedRecords] = useState(false)
  const [clickedBooks,setClickedBooks] = useState(false)
  const [books,setBooks] = useState([])
  const [loading,setLoading] = useState(true)
  const handleLogOut = async () => {
    localStorage.removeItem('token')
    navigate('/admin/signin')
  }
  const fetchData = async () => {
      try{
        const token = localStorage.getItem('token')
        const [response1,response2,response3] = await Promise.all([
          fetch('http://localhost:5500/api/v1/admin/students', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5500/api/v1/admin/records', {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5500/api/v1/admin/books', {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        ]) 
        const res1 = await response1.json()
        const res2 = await response2.json()
        const res3 = await response3.json()
        setDataStudents(res1)
        setRecords(res2?.records || [])
        setBooks(res3)
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
          <button className={!clickedStudents ? `text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`
              :
              `hidden`
            }
            onClick={e => setClickedStudents(true)}>View All Students</button>
            {clickedStudents && (
  dataStudents?.data?.students?.length > 0 ? (
    <table className='text-white border-2 mt-20 overflow-x-auto' cellPadding={"10"} cellSpacing={"10"}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Books borrowed</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {dataStudents.data.students.map((student) => (
          <tr key={student._id} className='border-2 border-white text-center'>
            <td>{student.name}</td>
            <td>{student.booksBorrowed.length > 0 ? student.booksBorrowed.join(' | ') : 'N/A'}</td>
            <td>{student.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className='text-red-500 text-center'>No students found :(</div>
  )
)}
        </div>
        {/* <div className='flex flex-col mt-20 items-center'>
            <button className={!clickedRecords ? `text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`
              :
              `hidden`
            }
            onClick={e => setClickedRecords(true)}>View All Records</button>
            {
              clickedRecords ? (
                records.length > 0 ? (
                  <table className='text-white border-2 mt-20 overflow-x-auto' border={"1"} cellPadding={"10"} cellSpacing={"10"}>
                  <thead>
                    <tr>
                      <th>Student Email</th>
                      <th>ISBN</th>
                      <th>Borrowed Date</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      records.records.map((record,index) => {
                        return <tr key={record._id} className='border-2 border-white text-center'>
                          <td>{record.studentEmail}</td>
                          <td>{record.isbn}</td>
                          <td>{new Date(record.borrowedDate).toDateString()}</td>
                          <td>{new Date(record.dueDate).toDateString()}</td>
                        </tr>
                      })
                    }
                  </tbody>
                  </table>
                ) : (<div className='text-red-500 text-center'>No records found :(</div>)
              ) : (
                <></>
              )  
            }
        </div> */}
        <div className='flex flex-col mt-20 items-center'>
          <button className={`text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`}
            onClick={e => navigate('/admin/dashboard/add-book')}>Add books</button>
        </div>
        <div className='flex flex-col items-center mt-20'>
          <button className={!clickedBooks ? `text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out`
              :
              `hidden`
            }
            onClick={e => setClickedBooks(true)}>View All Books</button>
            {clickedBooks && (
  books?.books?.length > 0 ? (
    <table className='text-white border-2 mt-20 overflow-x-auto' cellPadding={"10"} cellSpacing={"10"}>
      <thead>
        <tr>
          <th>ISBN</th>
          <th>Title</th>
          <th>Number of books available</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        {books?.books?.map((book) => (
          <tr key={book._id} className='border-2 border-white text-center'>
            <td>{book.isbn}</td>
            <td>{book.title}</td>
            <td>{book.count}</td>
            <td>{book.author}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className='text-red-500 text-center'>No books found :(</div>
  )
)}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard