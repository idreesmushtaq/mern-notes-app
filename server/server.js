const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Connect to the database
connectDB();

// Define a simple route
app.get("/", (req, res)=>{
    res.send ("API is running...");
})

const PORT = process.env.PORT || 5000;

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/protected", require("./routes/protectedRoutes"));


app.use("/api/notes", require("./routes/noteRoutes"));


const protectedRoutes = require("./routes/protectedRoutes");
app.use("/api/protected", protectedRoutes);



    
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});