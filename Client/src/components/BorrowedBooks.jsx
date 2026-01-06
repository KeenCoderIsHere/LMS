import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const BorrowedBooks = () => {
  const navigate = useNavigate()
  const [searchQuery,setSearchQuery] = useState('')
  const [filteredData,setFilteredData] = useState([])
  if(!localStorage.getItem('token')){
    return(
      <>
        <div className='flex flex-col p-5 items-center gap-y-5'>
          <h1 className='text-white text-5xl font-bold'>Authentication Error!</h1>
          <Link to={"/student/signin"}><h2 className='text-white rounded-full bg-blue-500 hover:bg-blue-700 transition-all duration-300 cursor-pointer px-3 py-2'>Authenticate yourself</h2></Link>
        </div>
      </>
    )
  }
  const [loading,setLoading] = useState(true)
  const [borrowedBooks,setBorrowedBooks] = useState(null)
  const fetchData = async () => {
      const token = localStorage.getItem('token')
      try{
        const response = await fetch('http://localhost:5500/api/v1/student/view-borrowed-books', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        })
        const res = await response.json()
        setBorrowedBooks(res)
        setFilteredData(res.data)
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
  const handleReturn = async (id) => {
    try{
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5500/api/v1/student/return/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const res = await response.json() 
      if(!res.success){
        alert(`Book return operation failed!`)
      }
      else{
        alert(`Book successfully returned!`)
        fetchData()
      }
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false)
    }
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
      <div className='flex flex-col gap-y-10 p-5'>
        <div className='text-white text-6xl text-center'>Borrowed Books</div>
        <div className='flex flex-row flex-wrap mx-auto mt-10'>
            <div className='flex flex-row bg-white rounded-full px-5 py-2'>
              <input 
              placeholder='Search for any book..' 
              className='border-none bg-none outline-none focus:outline-none'
              value={searchQuery}
              onChange={e => {
                const val = e.target.value
                setSearchQuery(val)
                const results = borrowedBooks.data.filter((book) =>
                  book.title.toLowerCase().includes(val.toLowerCase()) ||
                  book.author.toLowerCase().includes(val.toLowerCase()) ||
                  book.genre.toLowerCase().includes(val.toLowerCase()) ||
                  book.isbn.includes(val)
                )
                setFilteredData(results)
              }}
              />
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#2563eb" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            </div>
          </div>
        <div className='overflow-x-auto overflow-y-auto max-h-[65vh]'>
  {filteredData.length > 0 ? (
    <table cellPadding={"10"} cellSpacing={"10"} className='border-2 border-white text-white mx-auto'>
      <thead>
        <tr>
          <th>ISBN</th>
          <th>Book Title</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Borrowed Date</th>
          <th>Due Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {borrowedBooks.data.map((book, index) => (
          <tr key={index} className='border-2 border-white text-white text-center'>
            <td>{book.isbn}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.genre}</td>
            <td>{new Date(book.borrowedDate).toDateString()}</td>
            <td>{new Date(book.dueDate).toDateString()}</td>
            <td>
              <div 
                onClick={() => handleReturn(book.isbn)} 
                className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out'
              >
                Return
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className='text-2xl text-white font-bold text-center'>No books borrowed</p>
  )}
        </div>
        {
          borrowedBooks.amount > 0 
          ? 
          <div className='text-xl text-white text-center'>Total Due Amount: {borrowedBooks.amount}Rs</div>
          :
          <div className='text-xl text-white text-center'>No Dues Pending.</div>
        }
        
      </div>
    </>
  )
}

export default BorrowedBooks