const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const jwt_secret = process.env.JWT_SECRET_KEY;

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
      console.log("No Authorization header found for User.");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log('Token:', token);

    const decoded = jwt.verify(token, jwt_secret);

    if (!decoded) {
        return res.status(401).json({ error: "Session token expired or invalid!" });
    }

    console.log('decoded is', decoded)
    const user_id = decoded.userId; // Extract user ID from decoded token

    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "User") {
      return res.status(403).json({ error: "Access forbidden: Not a user" });
    }

    // Store user ID on the request object for use in subsequent middleware or routes
    req.userId = user_id;

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(401).json({ error: "Session token expired or invalid!" });
  }
};

module.exports = userAuth;
