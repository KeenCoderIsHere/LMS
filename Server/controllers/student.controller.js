import bcrypt from 'bcrypt'
import { Student } from '../models/student.model.js'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  try{
    const { name, email, password } = req.body
    const existingStudent = await Student.findOne({ email })
    if(existingStudent){
      return res.status(409).json({
        success: false,
        message: "Student with given email exists!"
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newStudent = await Student.create({
      name, 
      email,
      password: hashedPassword
    })

    const token = jwt.sign( { student: newStudent._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } )
    res.status(200).json({
      success: true,
      message: "Student Account Created Successfully!",
      data: {
        student: newStudent,
        token
      }
    })
  }
  catch(error){
    next(error)
  }
}

export const signin = async (req, res, next) => {
  try{
    const students = await Student.updateMany(
      {},
      { $set: {
        booksBorrowed: [],
        booksBorrowedCount: 0,
        dueAmount: 0
      }}
    )
    const { email, password } = req.body
    const existingStudent = await Student.findOne({ email })
    if(!existingStudent){
      return res.status(404).json({
        success: false,
        message: "No Student Account Found With Given Credentials!"
      })
    }
    const isValidPassword = await bcrypt.compare(password, existingStudent.password)
    if(!isValidPassword){
      return res.status(401).json({
        success: false,
        message: "Password doesn't match!"
      })
    }
    const token = jwt.sign( { student: existingStudent._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.status(200).json({
      success: true,
      message: "Logged In Successfully!",
      data: {
        token,
        student: existingStudent
      }
    })
  }
  catch(error){
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try{
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
      return res.json({
        success: false,
        message: "No bearer token"
      })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    const student = await Student.findById(decoded.student)
    return res.json({
      student
    })
  }
  catch(error){
    next(error)
  }
}
