const complaintModel = require("../../models/complaintModel");

const createComplaint = async (req, res) => {
    try {
        const { title, category, description } = req.body;

        if (!title || !category || !description) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const studentId = req.userId; // coming from JWT middleware

        const complaint = new complaintModel({
            student: studentId,
            title,
            category,
            description
        });

        await complaint.save();

        return res.status(201).json({
            message: 'Complaint submitted successfully!',
            complaintId: complaint._id
        });

    } catch (error) {
        console.error('Complaint creation error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getStudentComplaints = async (req, res) => {
    try {
        const studentId = req.userId;

        const complaints = await complaintModel.find({ student: studentId }).sort({ createdAt: -1 });

        const formatted = complaints.map((c) => ({
            id: c._id,
            title: c.title,
            category: c.category,
            status: c.status,
            date: c.createdAt.toISOString().split('T')[0]
        }));

        return res.status(200).json({ complaints: formatted });
    } catch (error) {
        console.error("Fetch complaints error:", error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createComplaint,
    getStudentComplaints
}