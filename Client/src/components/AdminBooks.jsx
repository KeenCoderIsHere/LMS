  import React from 'react'
  import { useState } from 'react'
  import { useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { Link } from 'react-router-dom'
  import { BASE_URL } from '../config/env.js'
  const AdminBooks = () => {
    const [searchQuery,setSearchQuery] = useState('')
    if (!localStorage.getItem('token')) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl text-center">
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
    const [bookData,setBookData] = useState(null)
    const [filteredBooks,setFilteredBooks] = useState([])
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const fetchData = async () => {
        try{
          const token = localStorage.getItem('token')
          const response = await fetch(`${BASE_URL}/api/v1/admin/admin-books`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          const res = await response.json()
          setBookData(res)
          console.log(res)
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

    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-5xl md:text-6xl font-bold text-white text-center mb-12">
          Available Books
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-xl flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-xl">
            <input
              placeholder="Search for any book.."
              className="flex-1 bg-transparent text-white placeholder:text-white/60 outline-none"
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
              stroke="#60a5fa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {
          filteredBooks.length > 0 ? (
            <div className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="overflow-y-auto max-h-[65vh] overflow-x-auto">
                <table
                  className="w-full text-white"
                  cellPadding={"10"}
                  cellSpacing={"10"}
                  border={"1"}
                >
                  <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-xl">
                    <tr>
                      <th className="px-6 py-5 text-left font-semibold">
                        Book ISBN
                      </th>
                      <th className="px-6 py-5 text-left font-semibold">
                        Book Title
                      </th>
                      <th className="px-6 py-5 text-left font-semibold">
                        Author
                      </th>
                      <th className="px-6 py-5 text-left font-semibold">
                        Genre
                      </th>
                      <th className="px-6 py-5 text-left font-semibold">
                        Available Copies
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      filteredBooks.map((book, index) => {
                        return (
                          <tr
                            className="border-t border-white/10 hover:bg-white/5 transition-all duration-300"
                            key={index}
                          >
                            <td className="px-6 py-4">{book.isbn}</td>
                            <td className="px-6 py-4">{book.title}</td>
                            <td className="px-6 py-4">{book.author}</td>
                            <td className="px-6 py-4">{book.genre}</td>
                            <td className="px-6 py-4">{book.count}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mt-16">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-12 py-8 shadow-xl">
                <p className="text-white text-2xl font-bold text-center">
                  No books found :(
                </p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  </>
)
  }

  export default AdminBooks