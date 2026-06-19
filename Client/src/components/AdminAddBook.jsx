import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config/env.js'

const AdminAddBook = () => {
  const navigate = useNavigate()
  const [showErrorBox,setShowErrorBox] = useState(false)
  const [error,setError] = useState('')
  const [title,setTitle] = useState('')
  const [isbn,setIsbn] = useState('')
  const [copies,setCopies] = useState('')
  const [author,setAuthor] = useState('')
  const [genre,setGenre] = useState('')
  const validate = () => {
    if(title.trim().length == 0){
      setError(`Title field is mandatory!`)
      return false
    }
    if(!isbn || isbn <= 0){
      setError(`ISBN field is mandatory!`)
      return false
    }
    if(!copies || copies <= 0){
      setError(`Copies field is mandatory!`)
      return false
    }
    if(author.trim().length == 0){
      setError(`Author field is mandatory!`)
      return false
    }
    if(genre.trim().length == 0){
      setError(`Genre field is mandatory!`)
      return false
    }
    return true
  }
  const handleSubmit = async () => {
    try{
      setError('')
      if(!validate()){
        setShowErrorBox(true)
        return
      }
      const token = localStorage.getItem('token')
      const response = await fetch(`${BASE_URL}/api/v1/admin/add-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          author,
          copies: Number(copies),
          isbn,
          genre
        })
      })
      const res = await response.json()
      if(!res.success){
        setError(res.message)
        setShowErrorBox(true)
      }
      else{
        setError('Book details added successfully!')
        setShowErrorBox(true)
      }
    } 
    catch(error){
      console.error(error)
    }
  }
  return (
  <>
    {
      showErrorBox &&
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-8">
          <div className="text-white text-lg text-center leading-relaxed">
            {error}
          </div>

          <button
            onClick={() => {
              if(error === "Book details added successfully!"){
                setShowErrorBox(false)
                navigate('/admin/dashboard')
              }
              else{
                setShowErrorBox(false)
              }
            }}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-all duration-300"
          >
            OK
          </button>
        </div>
      </div>
    }

    <div className="min-h-screen px-6 py-8">
      <div
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-all duration-300 text-lg font-medium"
      >
        ← Back
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-5xl font-bold text-white text-center mb-12">
          Add Book Form
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="flex flex-col gap-8">
            <label className="flex flex-col gap-3 text-white font-medium">
              Enter book title:
              <input
                placeholder=""
                className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-3 text-white font-medium">
              Enter book ISBN:
              <input
                placeholder=""
                className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                type="number"
                required
                value={isbn}
                onChange={e => setIsbn(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-3 text-white font-medium">
              Enter book author:
              <input
                placeholder=""
                className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                type="text"
                required
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-3 text-white font-medium">
              Enter number of book copies available:
              <input
                placeholder=""
                className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                type="number"
                required
                value={copies}
                onChange={e => setCopies(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-3 text-white font-medium">
              Enter the book genre:
              <input
                placeholder=""
                className="w-full bg-white/90 text-black px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                type="text"
                required
                value={genre}
                onChange={e => setGenre(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl cursor-pointer transition-all duration-300"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)
}

export default AdminAddBook