import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"
import { Record } from "../models/record.model.js"
import { Student } from "../models/student.model.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Admin from '../models/admin.model.js'
import { Book } from "../models/book.model.js"
import redisClient from "../config/redis.js"
export const getAllStudents = async(req, res, next) => {
  try{
    const DEFAULT_EXPIRATION = 3600
    const cachedStudents = await redisClient.get('students')
    if(cachedStudents){
      return res.status(200).json({
        success: true,
        students: JSON.parse(cachedStudents)
      })
    } 
    const students = await Student.find({})
    await redisClient.setEx('students', DEFAULT_EXPIRATION, JSON.stringify(students))
    res.status(200).json({
      success: true,
      students
    })
  }
  catch(error){
    next(error)
  }
}

export const getAllRecords = async (req, res, next) => {
  try{
    const records = await Record.find({})
    res.status(200).json({
      success: true,
      records
    })
  }
  catch(error){
    next(error)
  }
}

export const signinAdmin = async (req, res, next) => {
  try{
    const { email, password } = req.body
    const existingAdmin = await Admin.findOne({ email })
    if(!existingAdmin){
      return res.status(404).json({
        success: false,
        message: "No such admin found with given credentials"
      })
    }
    const isValidPassword = await bcrypt.compare(password, existingAdmin.password)
    if(!isValidPassword){
      return res.status(404).json({
        success: false,
        message: "Password doesn't match"
      })
    }
    const token = jwt.sign({ data: email, role: "admin" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.status(200).json({
      success: true,
      message: "Admin Logged In Successfully!",
      data: {
        email,
        password: existingAdmin.password,
        token
      }
    })
  }
  catch(error){
    next(error)
  }
}

export const addBook = async (req, res, next) => {
  try{
    const { title, copies, author, isbn, genre } = req.body
    const availBooks = await Book.findOne({ isbn: isbn })
    if(availBooks){
      return res.json({
        success: false,
        message: "Book with same ISBN already exists!"
      })
    }
    const books = await Book.create({
      title,
      count: copies,
      author,
      isbn,
      genre,
      with: []
    })
    return res.status(200).json({
      success: true,
      message: "Book added successfully!",
      book: books
    })
  }
  catch(error){
    next(error)
  }
}