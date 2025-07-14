const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = require("../../models/studentModel");

const signupFunction = async (req, res) => {
    const { firstName, lastName, email, department, password } = req.body;
    console.log("Sign up details:", firstName, lastName, email, department, password);

    try {
        if (!firstName || !lastName || !email || !department || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Check if student already exists
        const existingStudent = await studentModel.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: "Student already exists!" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new student
        const newStudent = new studentModel({
            name: `${firstName} ${lastName}`,
            email,
            department,
            password: hashedPassword,
            role: "Student"
        });

        await newStudent.save();

        return res.status(201).json({
            message: "Student registered successfully!",
            studentId: newStudent._id,
            name: newStudent.name,
            department: newStudent.department
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal Server error!" });
    }
};



const loginFunction = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    try {
        const student = await studentModel.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: "Student does not exist!" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        if (student.role !== "Student") {
            return res.status(403).json({ error: "User must be a student to login!" });
        }

        // Generate token
        const token = jwt.sign(
            {
                userId: student._id,
                role: student.role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful!",
            token,
            studentId: student._id,
            name: student.name,
            email: student.email,
            department: student.department
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server error!" });
    }
};



const logoutFunction = (req, res) => {
    try {
        const token = req.headers.authorization?.split(' '); // Extract token
        if (!token) {
            return res.status(400).json({ message: 'Token not provided' });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY, { ignoreExpiration: true }); // Verify, but ignore expiration
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({ message: 'Invalid Token' });
            }
        }
        //At this point, the token is either valid or expired
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    signupFunction,
    loginFunction,
    logoutFunction
}