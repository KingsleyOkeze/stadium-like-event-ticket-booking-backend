const express = require("express");
const { 
    signupFunction,
    loginFunction
} = require("../controllers/student-controllers/authControllers");
const { 
    createComplaint,
    getStudentComplaints
} = require("../controllers/student-controllers/complaintControllers");

const studentAuth = require("../middlewares/studentAuth");

const router = express.Router()

router.post("/signup", signupFunction);
router.post("/login", loginFunction);

router.use(studentAuth);
router.post('/complaints', createComplaint);
router.get('/student-complaints', getStudentComplaints);

module.exports = router;