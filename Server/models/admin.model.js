import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
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
  }
}, { timestamps: true })

const Admin = mongoose.model('Admin', adminSchema)

export default Admin