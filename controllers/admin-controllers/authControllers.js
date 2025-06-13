const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminModel = require("../../models/adminModel");

const signupFunction = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log("sign up details", firstName, lastName, email, password)
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }
       

        // Check if user already exists
        let existing_user = await adminModel.findOne({ email });
        if (existing_user) return res.status(400).json({ error: "User already exists!" });


        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new adminModel({ firstName, lastName, email, password: hashedPassword, role: "Admin" });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.log("sign up error", error)
        return res.status(500).json({ error: "Internal Server error!" });
    }
};


const loginFunction = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const admin = await adminModel.findOne({ email });
        if (!admin) return res.status(404).json({ error: "User does not exist!" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials!" });
        //check if the user is an admin
        if (admin.role !== "Admin") {
            return res.status(403).json({ error: "User must be an admin to login!" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: admin._id, 
                role: admin.role 
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "1h" }
        );
        return res.status(200).json({ 
            userId: admin._id, 
            token, 
            message: "Login successful!" 
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