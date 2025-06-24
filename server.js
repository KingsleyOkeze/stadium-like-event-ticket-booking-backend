require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const { startEventStatusUpdater } = require("./jobs/eventStatusUpdater");

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Allow all
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true
}));
app.use(express.json());
  

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('DB CONNECTED!')
    app.listen(PORT, () => {
        console.log(`SERVER LISTENING ON PORT ${PORT}`)
    });
    startEventStatusUpdater();
}).catch((error) => {
    console.log("Error connecting to DB:", error);
})



app.use("/admin", adminRoutes);
app.use("/user", userRoutes); 

