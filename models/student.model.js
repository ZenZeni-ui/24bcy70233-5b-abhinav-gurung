import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  roll: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
  },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;