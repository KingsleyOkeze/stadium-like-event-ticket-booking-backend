const express = require("express");
const { 
    signupFunction, 
    loginFunction,
    logoutFunction
} = require("../controllers/admin-controllers/authControllers");
const { getAllComplaints, updateComplaintStatus, getComplaintById, getComplaintStats } = require("../controllers/admin-controllers/complaintControllers");

const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

router.post("/signup", signupFunction);
router.post("/login", loginFunction);
// router.post("/logout", logoutFunction)

router.use(adminAuth)
router.get('/all-complaints', getAllComplaints);
router.get('/complaints/:id', getComplaintById);
router.put('/update-complaint-status/:id', updateComplaintStatus);
router.get('/report-stats', getComplaintStats);


module.exports = router;