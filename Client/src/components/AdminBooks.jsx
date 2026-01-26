  import React from 'react'
  import { useState } from 'react'
  import { useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { Link } from 'react-router-dom'
  //import redisClient from '../../../Server/config/redis'
  const AdminBooks = () => {
    const [searchQuery,setSearchQuery] = useState('')
    if(!localStorage.getItem('token')){
      return(
        <>
          <div className='flex flex-col p-5 items-center gap-y-5 '>
            <h1 className='text-white text-5xl font-bold'>Authentication Error!</h1>
            <Link to={"/student/signin"}><h2 className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out'>Authenticate yourself</h2></Link>
          </div>
        </>
      )
    }
    const [bookData,setBookData] = useState(null)
    const [filteredBooks,setFilteredBooks] = useState([])
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const fetchData = async () => {
        try{
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:5500/api/v1/student/view-books', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          const res = await response.json()
          setBookData(res)
          setFilteredBooks(res.books || [])
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
        <div className='flex flex-col p-5'>
          <div className='text-6xl text-white text-center'>Available Books</div>
          <div className='flex flex-row flex-wrap mx-auto mt-10'>
            <div className='flex flex-row bg-white rounded-full px-5 py-2'>
              <input 
              placeholder='Search for any book..' 
              className='border-none bg-none outline-none focus:outline-none'
              value={searchQuery}
              onChange={e => {
                const val = e.target.value
                setSearchQuery(val)
                const results = bookData.books.filter((book) =>
                  book.title.toLowerCase().includes(val.toLowerCase()) ||
                  book.author.toLowerCase().includes(val.toLowerCase()) ||
                  book.genre.toLowerCase().includes(val.toLowerCase()) ||
                  book.isbn.includes(val)
                )
                setFilteredBooks(results)
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
          {
            filteredBooks.length > 0 ? (
              <div className='overflow-y-auto max-h-[65vh] mx-auto mt-10 overflow-x-auto'>
          <table className='border-2 border-white mt-10 border-collapse' cellPadding={"10"} cellSpacing={"10"} border={"1"}>
            <thead className='text-white'>
              <tr>
                <th>Book ISBN</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Available Copies</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredBooks.map((book, index) => {
                  return <tr className='text-white border-2 text-center' key={index}>
                    <td>{book.isbn}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.count}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
          </div>
            ) : (
              <p className='text-white text-2xl text-center font-bold mt-10'>No books found :(</p>
            )
          }
        </div>
      </>
    )
  }

  export default AdminBooks