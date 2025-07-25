const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });



const adminModel = mongoose.model('admins', adminSchema);

module.exports = adminModel;