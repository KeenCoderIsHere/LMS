import express from 'express'
import { PORT } from './config/env.js'
import cookieParser from 'cookie-parser'
import { studentRouter } from './routes/student.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { connectToDatabase } from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import { updateStudentFines } from './service/fine.service.js'
import cors from 'cors'
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/student', studentRouter)
app.use('/api/v1/admin', adminRouter)

app.use(errorMiddleware) 
 
app.listen(PORT, async () => {
  await connectToDatabase()
  setInterval(updateStudentFines, 1000*60*60*24)
  updateStudentFines()
})