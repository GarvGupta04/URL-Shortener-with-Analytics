
const express = require("express");

const router = express.Router();

const {
    getOverview,
    getDailyClicks,
    getUrlAnalytics
} = require("../controllers/analyticsController");

// Overall dashboard statistics
router.get("/overview", getOverview);

// Daily click statistics
router.get("/daily-clicks", getDailyClicks);

// Analytics for an individual URL
router.get("/urls/:id", getUrlAnalytics);

module.exports = router;
