import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminAddBook = () => {
  const navigate = useNavigate()
  const [showErrorBox,setShowErrorBox] = useState(false)
  const [error,setError] = useState('')
  const [title,setTitle] = useState('')
  const [isbn,setIsbn] = useState(0)
  const [copies,setCopies] = useState(0)
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
      const response = await fetch('http://localhost:5500/api/v1/admin/add-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          author,
          copies,
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
        navigate('/admin/dashboard')
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border-2 bg-gray-900 border-slate-700 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-y-6">
            <div className="text-white text-xl text-center leading-relaxed">
              {error}
            </div>
            <button 
              onClick={() => setShowErrorBox(false)}
              className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out"
            >
              OK
            </button>
          </div>
        </div>
      }
      <div className='flex flex-col p-5'>
        <div onClick={() => navigate(-1)} className="fixed top-0 left-0 p-4 cursor-pointer hover:text-blue-700 duration-300 transition-all ease-in-out text-white z-50 text-2xl">←Back</div>
        <div className='text-3xl text-white text-center'>Add Book Form</div>
        <div className='flex flex-col gap-y-7 items-center mt-20'>
          <label className='text-white text-center'>
            Enter book title: 
            <input placeholder='' className='ml-5 text-black px-2 py-1' type='text' required value={title} onChange={e => setTitle(e.target.value)}/>
          </label>
          <label className='text-white text-center'>
            Enter book ISBN: 
            <input placeholder='' className='ml-5 text-black px-2 py-1' type='number' required value={isbn} onChange={e => setIsbn(parseInt(e.target.value))}/>
          </label>
          <label className='text-white text-center'>
            Enter book author: 
            <input placeholder='' className='ml-5 text-black px-2 py-1' type='text' required value={author} onChange={e => setAuthor(e.target.value)}/>
          </label>
          <label className='text-white text-center'>
            Enter number of book copies available: 
            <input placeholder='' className='ml-5 text-black px-2 py-1' type='number' required value={copies} onChange={e => setCopies(parseInt(e.target.value))}/>
          </label>
          <label className='text-white text-center'>
            Enter the book genre: 
            <input placeholder='' className='ml-5 text-black px-2 py-1' type='text' required value={genre} onChange={e => setGenre(e.target.value)}/>
          </label>
          <button type='submit' className='text-blue-500 hover:text-blue-700 hover:underline cursor-pointer duration-300 transition-all ease-in-out' onClick={() => handleSubmit()}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default AdminAddBook