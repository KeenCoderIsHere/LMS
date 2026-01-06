import React from 'react'
import {BrowserRouter, Router, Routes, Route} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import AdminSignIn from './components/AdminSignIn'
import StudentSignIn from './components/StudentSignIn'
import StudentSignUp from './components/StudentSignUp'
import AdminDashboard from './components/AdminDashboard'
import StudentDashboard from './components/StudentDashboard'
import Books from './components/Books'
import BorrowedBooks from './components/BorrowedBooks'
import AdminAddBook from './components/AdminAddBook'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />}/>
            <Route path='/admin/signin' element={<AdminSignIn />}/>
            <Route path='/admin/dashboard' element={<AdminDashboard />}/>
            <Route path='/admin/dashboard/add-book' element={<AdminAddBook/>}/>
            <Route path='/student/signin' element={<StudentSignIn/>}/>
            <Route path='/student/signup' element={<StudentSignUp />}/>
            <Route path='/student/dashboard' element={<StudentDashboard />}/>
            <Route path='/student/dashboard/books' element={<Books />}/>
            <Route path='/student/dashboard/borrowed-books' element={<BorrowedBooks />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App