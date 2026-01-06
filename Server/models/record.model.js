import mongoose, { mongo } from "mongoose"

const recordSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true
  },
  borrowedDate: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  }
}, { timestamps: true })

recordSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false
  const due = new Date(this.dueDate)
  const today = new Date()
  return due < today
})

recordSchema.set('toJSON', { virtuals: true })
recordSchema.set('toObject', { virtuals: true })

export const Record = mongoose.model('Record',recordSchema)
