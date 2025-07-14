const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    resolutionNote: { type: String, default: '' },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    createdAt: { type: Date, default: Date.now }
});

const complaintModel = mongoose.model('complaints', complaintSchema);

module.exports = complaintModel