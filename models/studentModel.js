const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'Student' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;