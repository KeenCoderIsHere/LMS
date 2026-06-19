import { Router } from "express";
import { addBook, getAllRecords, getAllStudents, signinAdmin } from "../controllers/admin.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { getBooks } from "../controllers/book.controller.js";
import { getAdminBooks } from "../controllers/book.controller.js";

export const adminRouter = Router()

adminRouter.get('/students', isAdmin, getAllStudents)

adminRouter.get('/records', isAdmin, getAllRecords)

adminRouter.get('/admin-books', getAdminBooks)

adminRouter.post('/add-book', addBook)

adminRouter.post('/signin', signinAdmin)