const express = require("express");
const { 
    signupFunction, 
    loginFunction 
} = require("../controllers/user-controllers/authControllers");
const { fetchEventsByStatus, getEventDetailsById } = require("../controllers/user-controllers/eventControllers");
const { 
    // verifyPaymentAndBookTicket,
    bookEventFunction,
    getUserTicketsFunction
 } = require("../controllers/user-controllers/ticketController");
const userAuth = require("../middlewares/userAuth");

const router = express.Router()

router.post("/signup", signupFunction);
router.post("/login", loginFunction);

router.use(userAuth);
router.get('/events-by-status', fetchEventsByStatus);
router.get('/fetch-event-details/:eventId', getEventDetailsById);

// router.post("/book-free-event", bookFreeEventFunction);
router.post("/book-event", bookEventFunction);
router.get("/tickets", getUserTicketsFunction)
// router.post("/verify-payment", verifyPaymentAndBookTicket);
// router.post('/book/:eventId',  bookTicket);
// router.get('/my', protectUser, getUserTickets);

module.exports = router;