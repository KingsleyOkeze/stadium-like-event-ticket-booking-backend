const complaintModel = require("../../models/complaintModel");

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await complaintModel.find()
            .sort({ createdAt: -1 })
            .populate('student', 'name');

        const formatted = complaints.map((c) => ({
            id: c._id,
            title: c.title,
            category: c.category,
            status: c.status,
            submittedBy: c.student?.name || 'N/A',
            date: c.createdAt.toISOString().split('T')[0]
        }));

        return res.status(200).json({ complaints: formatted });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};


const getComplaintById = async (req, res) => {
    try {
        const complaint = await complaintModel.findById(req.params.id)
            .populate('student', 'name');

        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        return res.status(200).json({ complaint });
    } catch (error) {
        console.error("Error fetching complaint:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolutionNote } = req.body;

        const updatedComplaint = await complaintModel.findByIdAndUpdate(
            id,
            { status, resolutionNote },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        return res.status(200).json({
            message: "Complaint updated successfully!",
            complaint: updatedComplaint
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


const getComplaintStats = async (req, res) => {
    try {
        const total = await complaintModel.countDocuments();
        const pending = await complaintModel.countDocuments({ status: 'Pending' });
        const inReview = await complaintModel.countDocuments({ status: 'In Review' });
        const resolved = await complaintModel.countDocuments({ status: 'Resolved' });
        const rejected = await complaintModel.countDocuments({ status: 'Rejected' });

        return res.status(200).json({
            total,
            pending,
            inReview,
            resolved,
            rejected
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


module.exports = {
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    getComplaintStats
}