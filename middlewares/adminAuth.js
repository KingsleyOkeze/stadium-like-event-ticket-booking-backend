const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
require("dotenv").config();

const jwt_secret = process.env.JWT_SECRET_KEY;

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
      console.log("No Authorization header found for admin.");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log('Token:', token);

    const decoded = jwt.verify(token, jwt_secret);

    if (!decoded) {
      console.log("Session token expired or invalid!");
      return res.status(401).json({ error: "Session token expired or invalid!" });
    }

    console.log('Decoded token:', decoded);
    const adminId = decoded.userId; // Extract student ID from decoded token

    const user = await adminModel.findById(adminId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({ error: "Access forbidden: Not a admin" });
    }

    // Store admin ID on the request object for use in subsequent middleware or routes
    req.adminId = adminId; 

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying admin token", error);
    return res.status(401).json({ error: "Session token expired or invalid!" });
  }
};

module.exports = adminAuth;
