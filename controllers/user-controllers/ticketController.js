// const QRCode = require('qrcode');
const ticketModel = require('../../models/ticketModel');
const eventModel = require('../../models/eventModel');

const getUserTicketsFunction = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;

        const total = await ticketModel.countDocuments({ user: req.userId });

        const tickets = await ticketModel.find({ user: req.userId })
            .populate("event") // Pull event data like title, date, etc.
            .sort({ bookedAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            tickets,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).json({ error: "Failed to load tickets" });
    }
};


// const verifyPaymentAndBookTicket = async (req, res) => {
//     const { reference, eventId } = req.body;
//     const userId = req.user._id;

//     if (!reference || !eventId) {
//         return res.status(400).json({ success: false, message: "Missing reference or eventId" });
//     }

//     try {
//         // 1. Verify payment with Paystack
//         const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
//             }
//         });

//         const paymentData = response.data;

//         if (!paymentData.status || paymentData.data.status !== "success") {
//             return res.status(400).json({ success: false, message: "Payment verification failed" });
//         }

//         // 2. Check if ticket already exists for this user + event
//         const existingTicket = await ticketModel.findOne({ user: userId, event: eventId });
//         if (existingTicket) {
//             return res.status(409).json({ message: "You have already booked this event" });
//         }

//         // 3. Fetch event details
//         const event = await eventModel.findById(eventId);
//         if (!event) {
//             return res.status(404).json({ success: false, message: "Event not found" });
//         }

//         if (event.seatsAvailable <= 0) {
//             return res.status(400).json({ success: false, message: "No seats available for this event" });
//         }

//         // 4. Generate QR Code string (you could encode eventId + userId)
//         const qrString = `${eventId}_${userId}_${new Date().getTime()}`;

//         // 5. Create Ticket
//         const ticket = await ticketModel.create({
//             user: userId,
//             event: eventId,
//             qrCode: qrString,
//             price: event.ticketPrice,
//             isVerified: true
//         });

//         // 6. Decrease available seats
//         event.seatsAvailable -= 1;
//         await event.save();

//         return res.status(200).json({ success: true, ticket });
//     } catch (error) {
//         console.error("Error verifying payment or booking:", error.message);
//         return res.status(500).json({ success: false, message: "Server error during verification" });
//     }
// };



// const bookFreeEventFunction = async (req, res) => {
//     const { eventId } = req.body;
//     const userId = req.userId;

//     console.log("free event detail", eventId, userId)
//     try {
//         if (!eventId) {
//             return res.status(400).json({ error: "Event ID is required" });
//         }
//         // 1. Fetch event
//         const event = await eventModel.findById(eventId);
//         if (!event) return res.status(404).json({ error: "Event not found" });

//         if (event.ticketPrice > 0) {
//             return res.status(400).json({ message: "This event is not free" });
//         }

//         if (event.seatsAvailable <= 0) {
//             return res.status(400).json({ message: "No seats available" });
//         }

//         // 2. Check if already booked
//         const alreadyBooked = await ticketModel.findOne({ user: userId, event: eventId });
//         if (alreadyBooked) {
//             return res.status(409).json({ message: "You already booked this event" });
//         }

//         // 3. Generate QR code
//         // const qrCode = `${eventId}_${userId}_${new Date().getTime()}`;

//         // 4. Create ticket
//         const ticket = await ticketModel.create({
//             user: userId,
//             event: eventId,
//             // qrCode,
//             price: 0,
//             isVerified: true
//         });

//         // 5. Decrement available seats
//         event.seatsAvailable -= 1;
//         await event.save();
//         console.log("Free event booked")
//         return res.status(200).json({ message: "Successfully booked event!", ticket });
//     } catch (error) {
//         console.error("Free booking failed:", error);
//         return res.status(500).json({ error: "Internal Server Error!" });
//     }
// };


const bookEventFunction = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.userId;

    console.log("free event detail", eventId, userId)
    try {
        if (!eventId) {
            return res.status(400).json({ error: "Event ID is required" });
        }
        // 1. Fetch event
        const event = await eventModel.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.status === 'Completed') {
            return res.status(400).json({ error: "You cannot book a completed event." });
        }

        if (event.seatsAvailable <= 0) {
            return res.status(400).json({ error: "No seats available" });
        }

        // 2. Check if already booked
        const alreadyBooked = await ticketModel.findOne({ user: userId, event: eventId });
        if (alreadyBooked) {
            return res.status(409).json({ error: "You already booked this event" });
        }

        // 4. Create ticket
        const ticket = await ticketModel.create({
            user: userId,
            event: eventId,
            price: 0,
            isVerified: true,
            paymentStatus: "Success"
        });

        // 5. Decrement available seats
        event.seatsAvailable -= 1;
        await event.save();
        console.log("Free event booked")
        return res.status(200).json({ message: "Successfully booked event!", ticket });
    } catch (error) {
        console.error("Free booking failed:", error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};



module.exports = {
    getUserTicketsFunction,
    bookEventFunction
}