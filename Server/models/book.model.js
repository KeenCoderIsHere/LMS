import mongoose, { mongo } from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 10
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    match: [/^\d{6}$/, 'ISBN must be exactly 6 digits']
  },
  with: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student'
  },
  genre: {
    type: String,
    required: true
  }
},{ timestamps: true })

export const Book = mongoose.model('Book', bookSchema)