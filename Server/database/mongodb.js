import mongoose from 'mongoose'
import { DB_URI, PORT } from '../config/env.js'

if(!DB_URI){
  throw new Error("Couldn't connect to database!")
}

export const connectToDatabase = async () => {
  try{
    await mongoose.connect(DB_URI)
  }
  catch(error){
    console.error("Error in connecting to database!")
    console.error(error)
    process.exit(1)
  }
}

