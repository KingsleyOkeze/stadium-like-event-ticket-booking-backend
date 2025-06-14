const adminModel = require("../../models/adminModel");

const fetchProfileFunction = async (req, res) => {
    try {
        const adminId = req.adminId;
        const admin = await adminModel.findById(adminId).select("firstName lastName email createdAt");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ admin });
    } catch (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    fetchProfileFunction
}