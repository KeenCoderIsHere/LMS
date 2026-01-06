import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { Student } from '../models/student.model.js'

export const authorize = async (req, res, next) => {
  try{
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const student = await Student.findById(decoded._id)
    req.student = student
    next()
  }
  catch(error){
    next(error)
  }
}

export const isAdmin = async (req, res, next) => {
  try{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No valid token provided"
      })
    }
    const token = authHeader.split(' ')[1]
    if(!token){
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token Missing"
      })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    if(decoded.role != "admin"){
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      })
    }
    next()
  }
  catch(error){
    next(error)
  }
}