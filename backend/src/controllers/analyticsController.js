
const db = require("../config/db");

// Get overall dashboard statistics
const getOverview = async (req, res) => {
    try {
        // Count total shortened URLs
        const [urlResult] = await db.query(
            "SELECT COUNT(*) AS totalUrls FROM urls"
        );

        // Calculate total clicks
        const [clickResult] = await db.query(
            "SELECT COALESCE(SUM(click_count), 0) AS totalClicks FROM urls"
        );

        // Calculate average clicks per URL
        const [averageResult] = await db.query(
            "SELECT COALESCE(AVG(click_count), 0) AS averageClicks FROM urls"
        );

        // Find the most popular URL
        const [popularResult] = await db.query(
            `SELECT id, original_url, short_code, short_url, click_count
             FROM urls
             ORDER BY click_count DESC, created_at DESC
             LIMIT 1`
        );

        res.status(200).json({
            status: "success",
            data: {
                totalUrls: Number(urlResult[0].totalUrls),
                totalClicks: Number(clickResult[0].totalClicks),
                averageClicks: Number(
                    Number(averageResult[0].averageClicks).toFixed(2)
                ),
                mostPopularUrl: popularResult[0] || null
            }
        });

    } catch (error) {
        console.error("Overview Analytics Error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch dashboard statistics"
        });
    }
};


// Get daily clicks for the last 7 days
const getDailyClicks = async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT
        DATE_FORMAT(clicked_at, '%Y-%m-%d') AS date,
        COUNT(*) AS clicks
     FROM url_clicks
     WHERE clicked_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       AND clicked_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
     GROUP BY DATE_FORMAT(clicked_at, '%Y-%m-%d')
     ORDER BY date ASC`
        );

        res.status(200).json({
            status: "success",
            data: results.map((row) => ({
                date: row.date,
                clicks: Number(row.clicks)
            }))
        });

    } catch (error) {
        console.error("Daily Clicks Error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch daily clicks"
        });
    }
};


// Get analytics for one particular URL
const getUrlAnalytics = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Validate URL ID
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid URL ID"
            });
        }

        // Get URL details
        const [urlResult] = await db.query(
            "SELECT * FROM urls WHERE id = ?",
            [id]
        );

        if (urlResult.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "URL not found"
            });
        }

        // Get daily clicks for this URL
        const [clickResults] = await db.query(
            `SELECT
        DATE_FORMAT(clicked_at, '%Y-%m-%d') AS date,
        COUNT(*) AS clicks
     FROM url_clicks
     WHERE url_id = ?
     GROUP BY DATE_FORMAT(clicked_at, '%Y-%m-%d')
     ORDER BY date ASC`,
            [id]
        );

        res.status(200).json({
            status: "success",
            data: {
                url: urlResult[0],
                dailyClicks: clickResults.map((row) => ({
                    date: row.date,
                    clicks: Number(row.clicks)
                }))
            }
        });

    } catch (error) {
        console.error("URL Analytics Error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch URL analytics"
        });
    }
};


module.exports = {
    getOverview,
    getDailyClicks,
    getUrlAnalytics
};
