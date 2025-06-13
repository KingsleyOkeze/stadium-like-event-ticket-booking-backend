const eventModel = require('../../models/eventModel');
const ticketModel = require('../../models/ticketModel');
const fs = require('fs');
const cloudinary = require("../../configs/cloudinaryConfig")


const createEventFunction = async (req, res) => {
    const {
        title,
        description,
        category,
        venue,
        date,
        time,
        // seatsAvailable,
        totalSeats,
        ticketPrice,
    } = req.body;

    console.log('File path before upload:', req.file.path);

    cloudinary

    try {
         // Validation
        if (!title || !venue || !date || !time || !totalSeats || !ticketPrice || !req.file) {
            return res.status(400).json({ error: 'Please fill all required fields.' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log('image url', result.secure_url)

        const event = await eventModel.create({
            title,
            description,
            category,
            venue,
            date,
            time,
            seatsAvailable: totalSeats,
            totalSeats,
            ticketPrice,
            eventImage: result.secure_url,
            createdBy: req.adminId
        });

        // Delete the uploaded file from local storage
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting local file:', err);
            } else {
                console.log('Local file deleted successfully.');
            }
        });

        console.log("Event uploaded successfully");

        return res.status(201).json({
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        console.error('Error creating event:', error);
        // Delete the locally stored file if an error occurred after upload to prevent junk files
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting local file after error:', unlinkErr);
            });
        }
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};

// @desc Get all events (paginated - 7 per page)
// @route GET /api/events?page=1
// @access Private (Admin)
const fetchEventsFunction = async (req, res) => {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 7;
    const skip = page * limit;
    
    const { statusFilter, categoryFilter, searchTerm } = req.query;

    console.log("fetch called", { statusFilter, categoryFilter, searchTerm });
    const filter = {};

    // Apply status filter
    if (statusFilter && statusFilter !== 'All') {
        filter.status = statusFilter;
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'All') {
        filter.category = categoryFilter;
    }

    // Apply search filter (case-insensitive, partial match on title)
    if (searchTerm && searchTerm.trim() !== '') {
        filter.title = { $regex: searchTerm.trim(), $options: 'i' };
    }


    try {
        const totalEvents = await eventModel.countDocuments(filter);
        const events = await eventModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        console.log("events log", events)

        return res.status(200).json({
            events,
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit),
            totalEvents
        });
    } catch (error) {
        console.log("fetching event error", error)
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};


const getEventByIdFunction = async (req, res) => {
    const { eventId } = req.params;
    
    try {
        const event = await eventModel.findById(eventId);

        if (!event) {
            res.status(404).json({ error: "Event not found."})
        }

        return res.status(200).json({ 
            event,
            message: "Successfully fetch event by id"})

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error!"})
    }
};


const getTicketsByEventFunction = async (req, res) => {
    const { eventId } = req.params;
    const page = req.query.page || 0;
    const limit = req.query.limit || 7;
    const skip = page * limit;

    try {
        const totalTickets = await ticketModel.countDocuments({});    
        const tickets = await ticketModel.find({ event: eventId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limt(limit)
            .populate('users', 'firstName lastName email')
            .populate('events', 'title ticketPrice date time');

        const totalSold = tickets.length;

        return res.status(200).json({
            eventId,
            totalPages: Math.ceil(totalTickets / limit),
            totalSold,
            tickets
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};


module.exports = {
    createEventFunction,
    fetchEventsFunction,
    getEventByIdFunction,
    getTicketsByEventFunction
}