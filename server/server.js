const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Define a simple route
app.get("/", (req, res)=>{
    res.send ("API is running...");
})

const PORT = process.env.PORT || 5000;

app.use("/api/notes", require("./routes/noteRoutes"));
    
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});