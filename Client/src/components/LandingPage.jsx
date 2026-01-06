import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <>
      <div className='flex flex-col'>
        <div className='text-5xl text-white text-center my-10'>Library Management System</div>
        <div className='flex flex-row justify-between p-5 gap-x-5 mt-30'>
          <div className='flex flex-col gap-y-5 justify-center items-center flex-1'>
            <Link to={"/admin/signin"}><div className='text-white rounded-full bg-blue-700 px-5 py-2 cursor-pointer hover:opacity-[0.7] transition-all duration-300 text-center'>Administration Portal</div></Link>
            <p className='text-white'>(For Admins)</p>
          </div>
          <div className='flex flex-col gap-y-10 justify-center items-center flex-1'>
            <Link to={"/student/signin"}><div className='text-white rounded-full bg-blue-700 px-5 py-2 cursor-pointer hover:opacity-[0.7] transition-all duration-300 text-center'>OPAC Portal</div></Link>
            <p className='text-white'>(For Borrowing Books)</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage