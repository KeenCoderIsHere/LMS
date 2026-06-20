import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/env.js';
const BorrowedBooks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowedBooks, setBorrowedBooks] = useState(null);
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/api/v1/student/view-borrowed-books`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      setBorrowedBooks(res);
      setFilteredData(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleReturn = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/v1/student/return/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log(res);
      if (!res.success) {
        alert(`Book return operation failed!`);
      } else {
        alert(`Book successfully returned!`);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (!localStorage.getItem('token')) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl text-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">
              Authentication Error!
            </h1>

            <Link to={'/student/signin'}>
              <h2 className="inline-flex items-center justify-center px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-all duration-300">
                Authenticate yourself
              </h2>
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
        <span className="text-white text-lg font-medium">Loading...</span>
      </div>
    );
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
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-white text-5xl md:text-6xl font-bold text-center">
            Borrowed Books
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xl flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-xl">
              <input
                placeholder="Search for any book.."
                className="flex-1 bg-transparent text-white placeholder:text-white/60 outline-none"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  const results = borrowedBooks.data.filter(
                    (book) =>
                      book.title.toLowerCase().includes(val.toLowerCase()) ||
                      book.author.toLowerCase().includes(val.toLowerCase()) ||
                      book.genre.toLowerCase().includes(val.toLowerCase()) ||
                      book.isbn.includes(val)
                  );
                  setFilteredData(results);
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

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[65vh]">
              {filteredData.length > 0 ? (
                <table cellPadding={'10'} cellSpacing={'10'} className="w-full text-white">
                  <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-xl">
                    <tr>
                      <th className="px-6 py-5 text-left font-semibold">ISBN</th>
                      <th className="px-6 py-5 text-left font-semibold">Book Title</th>
                      <th className="px-6 py-5 text-left font-semibold">Author</th>
                      <th className="px-6 py-5 text-left font-semibold">Genre</th>
                      <th className="px-6 py-5 text-left font-semibold">Borrowed Date</th>
                      <th className="px-6 py-5 text-left font-semibold">Due Date</th>
                      <th className="px-6 py-5 text-left font-semibold">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {borrowedBooks.data.map((book, index) => (
                      <tr
                        key={index}
                        className="border-t border-white/10 hover:bg-white/5 transition-all duration-300"
                      >
                        <td className="px-6 py-4">{book.isbn}</td>
                        <td className="px-6 py-4">{book.title}</td>
                        <td className="px-6 py-4">{book.author}</td>
                        <td className="px-6 py-4">{book.genre}</td>
                        <td className="px-6 py-4">{new Date(book.borrowedDate).toDateString()}</td>
                        <td className="px-6 py-4">{new Date(book.dueDate).toDateString()}</td>
                        <td className="px-6 py-4">
                          <div
                            onClick={() => handleReturn(book.bookId)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer transition-all duration-300"
                          >
                            Return
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12">
                  <p className="text-2xl text-white font-bold text-center">No books borrowed</p>
                </div>
              )}
            </div>
          </div>

          {borrowedBooks.amount > 0 ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl py-4 px-6 text-center text-white text-xl font-semibold">
              Total Due Amount: {borrowedBooks.amount}Rs
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl py-4 px-6 text-center text-white text-xl font-semibold">
              No Dues Pending.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BorrowedBooks;
