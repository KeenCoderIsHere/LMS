  import React from 'react'
  import { useState } from 'react'
  import { useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { Link } from 'react-router-dom'
  const Records = () => {
    const [searchQuery,setSearchQuery] = useState('')
    if(!localStorage.getItem('token')){
      return(
        <>
          <div className='flex flex-col p-5 items-center gap-y-5 '>
            <h1 className='text-white text-5xl font-bold'>Authentication Error!</h1>
            <Link to={"/admin/signin"}><h2 className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out'>Authenticate yourself</h2></Link>
          </div>
        </>
      )
    }
    const [recordsData,setRecordsData] = useState(null)
    const [filteredRecords,setFilteredRecords] = useState([])
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const fetchData = async () => {
        try{
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:5500/api/v1/admin/records', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          const res = await response.json()
          setRecordsData(res)
          setFilteredRecords(res.records || [])
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
          <div className='text-6xl text-white text-center'>Records / Transactions</div>
          <div className='flex flex-row flex-wrap mx-auto mt-10'>
            <div className='flex flex-row bg-white rounded-full px-5 py-2'>
              <input 
              placeholder='Search for any book..' 
              className='border-none bg-none outline-none focus:outline-none'
              value={searchQuery}
              onChange={e => {
                const val = e.target.value
                setSearchQuery(val)
                const results = recordsData.records.filter((record) =>
                  record.isbn.toString().includes(val.toString()) ||
                  record.studentEmail.toLowerCase().includes(val.toLowerCase())
                )
                setFilteredRecords(results)
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
            filteredRecords.length > 0 ? (
              <div className='overflow-y-auto max-h-[65vh] mx-auto mt-10 overflow-x-auto'>
          <table className='border-2 border-white mt-10 border-collapse' cellPadding={"10"} cellSpacing={"10"} border={"1"}>
            <thead className='text-white'>
              <tr>
                <th>ISBN</th>
                <th>Email ID</th>
                <th>Borrowed Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredRecords.map((record, index) => {
                  return <tr className='text-white border-2 text-center' key={index}>
                    <td>{record.isbn}</td>
                    <td>{record.studentEmail}</td>
                    <td>{new Date(record.borrowedDate).toDateString()}</td>
                    <td>{new Date(record.dueDate).toDateString()}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
          </div>
            ) : (
              <p className='text-white text-2xl text-center mt-10'>No Records found :(</p>
            )
          }
        </div>
      </>
    )
  }

  export default Records