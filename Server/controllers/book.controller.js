import { JWT_SECRET } from "../config/env.js"
import { Book } from "../models/book.model.js"
import jwt from 'jsonwebtoken'
import { Student } from "../models/student.model.js"
import { Record } from "../models/record.model.js"
import redisClient from '../config/redis.js'
export const getBooks = async (req, res, next) => {
  try{
    const DEFAULT_EXPIRATION = 3600
    const cachedBooks = await redisClient.get('books')
    if(cachedBooks){
      return res.status(200).json({
        success: true,
        books: JSON.parse(cachedBooks)
      })
    }
    const books = await Book.find({ count: {$gt: 0} })
    await redisClient.setEx('books', DEFAULT_EXPIRATION, JSON.stringify(books))
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
      const bookData = await Book.findById(book.bookId)
      if(bookData){
        requiredData.push({
        title: bookData.title,
        isbn: bookData.isbn,
        author: bookData.author,
        genre: bookData.genre,
        borrowedDate: book.borrowedDate,
        dueDate: book.dueDate,
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
    const found = false
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
    const x = await Student.findByIdAndUpdate(
      student._id,
      { $push: { booksBorrowed: book.isbn },
        $inc: { booksBorrowedCount: 1 }
      },
      { new: true }
    )
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
    const isbn = req.params.bookId
    const token = req.headers?.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const student = await Student.findById(decoded.student)
    const found = student.booksBorrowed.some(id => id.toString() === isbn.toString())
    if(found === false){
      return res.status(404).json({
        success: false,
        message: "You didn't borrow this book, so unable to return!"
      })
    }
    const y = await Book.findByIdAndUpdate(
      isbn,
      { $inc: { count: 1 } },
      { new: true }
    )
    const result = await Student.findByIdAndUpdate(
      decoded.student,
      { $pull: { booksBorrowed: isbn },
        $inc: { booksBorrowedCount: -1 }
      },
      { new: true }
    )
    const x = await Record.findOneAndDelete({ isbn, studentEmail: student.email })
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
    next(error)
  }
}

