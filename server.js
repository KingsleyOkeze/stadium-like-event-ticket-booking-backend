require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/studentRoutes");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
  

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('DB CONNECTED!')
    app.listen(PORT, () => {
        console.log(`SERVER LISTENING ON PORT ${PORT}`)
    });
}).catch((error) => {
    console.log("Error connecting to DB:", error);
})



app.use("/admin", adminRoutes);
app.use("/student", userRoutes); 

