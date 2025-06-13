const eventModel = require('../../models/eventModel');
const ticketModel = require('../../models/ticketModel');

// @desc Admin dashboard summary
// @route GET /api/admin/dashboard
// @access Private (Admin)
const getAdminHomeStatsFunction = async (req, res) => {
    try {
        const totalEvents = await eventModel.countDocuments({});
        const upcomingEvents = await eventModel.countDocuments({ status: 'Upcoming' });
        const totalTicketsSold = await ticketModel.countDocuments({});

        // Optionally get 5 most recent events
        const recentEvents = await eventModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title date status');

        return res.status(200).json({
            totalEvents,
            upcomingEvents,
            totalTicketsSold,
            recentEvents
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};


module.exports = {
    getAdminHomeStatsFunction
}