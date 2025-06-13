const eventModel = require("../../models/eventModel");

const fetchEventsByStatus = async (req, res) => {
    try {
        const status = req.query.status || "Upcoming";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
        const skip = (page - 1) * limit;

        const query = { status }; // ✅ Actually query by status field

        const events = await eventModel.find(query)
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit);

        const total = await eventModel.countDocuments(query);
        
        console.log("all events", events);

        return res.status(200).json({
            events,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error fetching events:", err);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};




const getEventDetailsById = async (req, res) => {
    console.log("eventId is", req.params.evenId);
    try {
        const event = await eventModel.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });
        console.log("event detail is", event)
        return res.status(200).json({ event });
    } catch (error) {
        console.error("Error loading event:", error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};

module.exports = {
    fetchEventsByStatus,
    getEventDetailsById
}