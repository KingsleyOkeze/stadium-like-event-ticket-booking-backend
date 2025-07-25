const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminModel = require("../../models/adminModel");

const signupFunction = async (req, res) => {
    const { name, email, department, password } = req.body;
    console.log("Sign up details:", name, email, department, password);

    try {
        if (!name || !email || !department || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "Admin already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new adminModel({
            name,
            email,
            department,
            password: hashedPassword,
            role: "Admin"
        });

        await newAdmin.save();

        return res.status(201).json({
            message: "Admin registered successfully!",
            adminId: newAdmin._id,
            name: newAdmin.name,
            department: newAdmin.department
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal Server error!" });
    }
};


const loginFunction = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: "Admin does not exist!" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        if (admin.role !== "Admin") {
            return res.status(403).json({ error: "User must be an admin to login!" });
        }

        const token = jwt.sign(
            {
                userId: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful!",
            token,
            userId: admin._id
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