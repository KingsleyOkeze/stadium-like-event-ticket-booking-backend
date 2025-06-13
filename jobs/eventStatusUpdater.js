const eventModel = require('../models/eventModel'); // Adjust path if needed

const eventStatusUpdater = async () => {
    try {
        const now = new Date();

        // Update Upcoming → Ongoing
        await eventModel.updateMany(
            {
                status: 'Upcoming',
                date: { $lte: now }
            },
            { $set: { status: 'Ongoing' } }
        );

        // Update Ongoing → Completed
        await eventModel.updateMany(
            {
                status: 'Ongoing',
                date: { $lt: now }
            },
            { $set: { status: 'Completed' } }
        );

        // console.log(`[${new Date().toISOString()}] Event statuses updated.`);
    } catch (err) {
        console.error("Error updating event statuses:", err);
    }
};

// Function to start periodic updates
const startEventStatusUpdater = () => {
    // Run once immediately
    eventStatusUpdater();

    // Then run every minute
    setInterval(eventStatusUpdater, 60 * 1000);
};

module.exports = { startEventStatusUpdater };
