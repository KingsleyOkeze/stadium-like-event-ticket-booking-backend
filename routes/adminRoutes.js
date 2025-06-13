const express = require("express");
const { 
    signupFunction, 
    loginFunction,
    logoutFunction
} = require("../controllers/admin-controllers/authControllers");
// const { getTicketsByEventFunction } = require("../controllers/admin-controllers/ticketController");
const upload = require("../middlewares/upload");
const { 
    createEventFunction, 
    fetchEventsFunction,
    getEventByIdFunction,
    getTicketsByEventFunction
} = require("../controllers/admin-controllers/eventControllers");
const { getAdminHomeStatsFunction } = require("../controllers/admin-controllers/homeController");
const adminAuth = require("../middlewares/adminAuth");


const router = express.Router();

router.post("/signup", signupFunction);
router.post("/login", loginFunction);
router.post("/logout", logoutFunction)

router.get("/fetch-home-stats", getAdminHomeStatsFunction) 

router.post("/create-event", adminAuth, upload, createEventFunction);
router.get("/fetch-events", fetchEventsFunction);
router.get('/get-event-by-id/:eventId', getEventByIdFunction);
router.get('/fetch-tickets-by-event-id/:eventId', getTicketsByEventFunction)


// router.get('/fetch-tickets', getTicketsByEventFunction)

module.exports = router;