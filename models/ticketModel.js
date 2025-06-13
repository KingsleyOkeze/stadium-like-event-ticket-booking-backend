const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // We'll define this model soon
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ["Success", "Cancelled"]
    }
}, {
    timestamps: true
});

const ticketModel = mongoose.model('tickets', ticketSchema);
module.exports = ticketModel;