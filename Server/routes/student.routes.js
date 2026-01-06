import { Router } from "express";
import { getMe, signin, signup } from "../controllers/student.controller.js";
import { borrow, getBooks, getBorrowedBooks, returnBook } from "../controllers/book.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

export const studentRouter = Router()

studentRouter.post('/signup', signup)

studentRouter.post('/signin', signin)

studentRouter.get('/view-books', authorize, getBooks)

studentRouter.get('/borrow/:bookId', authorize, borrow)

studentRouter.get('/view-borrowed-books', authorize, getBorrowedBooks)

studentRouter.put('/return/:bookId', authorize, returnBook)

studentRouter.get('/me', getMe)