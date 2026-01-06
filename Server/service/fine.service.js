import { Student } from '../models/student.model.js'
import { Record } from '../models/record.model.js'

export const updateStudentFines = async () => {
  try {
    const today = new Date()
    const records = await Record.find({
      dueDate: { $lt: today }
    })
    for (const record of records) {
      const dueDate = new Date(record.dueDate)
      if (dueDate < today) {
        await Student.findOneAndUpdate(
          { email: record.studentEmail },
          { $inc: { dueAmount: 10 } }
        )
      }
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Failed to update the increment the due amount!"
    })
  }
}