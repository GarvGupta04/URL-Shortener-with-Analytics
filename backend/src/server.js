
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// Import route files
const urlRoutes = require("./routes/urlRoutes");
const managementRoutes = require("./routes/managementRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("URL Shortener Backend is Running!");
});

// Database health check
app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.status(200).json({
            status: "success",
            message: "Backend and Database Connected Successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

// URL management APIs
// Keep this before the existing URL routes
app.use("/api/urls", managementRoutes);

// Existing URL creation and API routes
app.use("/api/urls", urlRoutes);

// Analytics APIs
app.use("/api/analytics", analyticsRoutes);

// Short URL redirection
app.use("/", urlRoutes);

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
