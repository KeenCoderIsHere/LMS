import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /\S+@\S+\.\S+/,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6
  },
  booksBorrowed: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Book'
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  booksBorrowedCount: {
    type: Number,
    default: 0
  },
  maxLimit: {
    type: Number,
    default: 10
  }
},{ timestamps: true })

export const Student = mongoose.model('Student',studentSchema)