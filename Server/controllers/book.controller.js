import { JWT_SECRET } from "../config/env.js"
import { Book } from "../models/book.model.js"
import jwt from 'jsonwebtoken'
import { Student } from "../models/student.model.js"
import { Record } from "../models/record.model.js"
import redisClient from '../config/redis.js'

export const getAdminBooks = async (req, res, next) => {
  try{
    const DEFAULT_EXPIRATION = 3600
    const cachedBooks = await redisClient.get('lms:books')
    if(cachedBooks){
      return res.status(200).json({
        success: true,
        books: JSON.parse(cachedBooks)
      })
    }
    const books = await Book.find({ count: {$gt: 0} })
    await redisClient.setEx(
      'lms:books',
      DEFAULT_EXPIRATION,
      JSON.stringify(books)
    )
    return res.status(200).json({
      success: true,
      books
    })
  }
  catch(error){
    next(error)
  }
}


export const getBooks = async (req, res, next) => {
  try{
    const DEFAULT_EXPIRATION = 3600
    const cachedBooks = await redisClient.get('lms:books')
    if(cachedBooks){
      return res.status(200).json({
        success: true,
        books: JSON.parse(cachedBooks)
      })
    }
    const books = await Book.find({ count: {$gt: 0} })
    await redisClient.setEx(
      'lms:books',
      DEFAULT_EXPIRATION,
      JSON.stringify(books)
    )
    return res.status(200).json({
      success: true,
      books
    })
  }
  catch(error){
    next(error)
  }
}

export const getBorrowedBooks = async (req, res, next) => {
  try{
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const student = await Student.findById(decoded.student)
    const borrowedBooks = await Record.find({ studentEmail: student.email })
    const requiredData = []
    for(let book of borrowedBooks){
      const bookData = await Book.find({title: book.title})
      if(bookData[0]){
        requiredData.push({
        title: bookData[0].title,
        isbn: bookData[0].isbn,
        author: bookData[0].author,
        genre: bookData[0].genre,
        borrowedDate: book.borrowedDate,
        dueDate: book.dueDate,
        bookId: bookData[0]._id
        })
      }
      else{
        console.error(`Book with Book ID ${book.bookId} not found in database`)
      }
    }
    res.status(200).json({
      success: true,
      data: requiredData,
      amount: student.dueAmount
    })
  }
  catch(error){
    next(error)
  }
}

export const  borrow = async (req, res, next) => {
  try{
    const bookId = req.params.bookId
    const book = await Book.findById(bookId)
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const student = await Student.findById(decoded.student)
    let found = false
    for(let book of student.booksBorrowed){
      if(book.toString() === bookId.toString()){
        found = true
      }
    }
    if(found){
      return res.status(409).json({
        success: false,
        message: "You cannot borrow a book you already have!"
      })
    }
    if(!book){
      return res.status(404).json({
        success: false,
        message: "No book found with given book ID!"
      })
    }
    if(book.count == 0){
      return res.status(404).json({
        success: false,
        message: "All copies of this book were borrowed!"
      })
    }
    const val = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { count: -1 } },
      { new: true }
    )
    await redisClient.del('lms:books')
    const x = await Student.findByIdAndUpdate(
      student._id,
      { $push: { booksBorrowed: book._id },
        $inc: { booksBorrowedCount: 1 }
      },
      { new: true }
    )
    console.log("Student after update:")
    console.log(x)
    console.log("booksBorrowed:", x.booksBorrowed)
    const y = await Record.insertOne({
      isbn: book.isbn,
      title: book.title,
      studentEmail: student.email,
      borrowedDate: new Date(Date.now()),
      dueDate: new Date(Date.now() + 5*24*60*60*1000)
    })
    res.status(200).json({
      success: true,
      message: "Book borrowed successfully!",
      data: y
    })
  }
  catch(error){
    next(error)
  }
}

export const returnBook = async (req, res, next) => {
  try{
    const bookId = req.params.bookId
    const token = req.headers?.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const student = await Student.findById(decoded.student)
    const found = student.booksBorrowed.some(id => id.toString() === bookId.toString())
    if(found === false){
      return res.status(404).json({
        success: false,
        message: "You didn't borrow this book, so unable to return!",
        student
      })
    }
    const y = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { count: 1 } },
      { new: true }
    )
    await redisClient.del('lms:books')
    const result = await Student.findByIdAndUpdate(
      decoded.student,
      { $pull: { booksBorrowed: bookId },
        $inc: { booksBorrowedCount: -1 }
      },
      { new: true }
    )
    const book = await Book.findById(bookId)
    const x = await Record.findOneAndDelete({ isbn: book.isbn, studentEmail: student.email })
    res.json({
      success: true,
      message: "Book returned successfully!",
      data: {
        returnedBook: x,
        student
      }
    })
  }
  catch(error){
    console.error(error)
    next(error)
  }
}

