const db = require("../config/db");

// Redirect user to the original URL
const redirectUrl = async (req, res) => {

    let connection;
    let transactionStarted = false;

    try {
        const { shortCode } = req.params;

        // Validate short code format
        if (!/^[A-Za-z0-9_-]{8}$/.test(shortCode)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid short code format"
            });
        }

        // Get database connection
        connection = await db.getConnection();

        // Start transaction
        await connection.beginTransaction();
        transactionStarted = true;

        // Find original URL
        const [rows] = await connection.execute(
            "SELECT id, original_url FROM urls WHERE short_code = ?",
            [shortCode]
        );

        // Check whether short URL exists
        if (rows.length === 0) {

            await connection.rollback();
            transactionStarted = false;

            return res.status(404).json({
                status: "error",
                message: "Short URL not found"
            });
        }

        const urlId = rows[0].id;
        const originalUrl = rows[0].original_url;

        // Increase click count
        await connection.execute(
            "UPDATE urls SET click_count = click_count + 1 WHERE id = ?",
            [urlId]
        );

        // Store individual click record
        await connection.execute(
            "INSERT INTO url_clicks (url_id) VALUES (?)",
            [urlId]
        );

        // Save database changes
        await connection.commit();
        transactionStarted = false;

        // Redirect to original URL
        return res.redirect(302, originalUrl);

    } catch (error) {

        // Undo incomplete database operations
        if (connection && transactionStarted) {
            await connection.rollback();
        }

        console.error("Redirection error:", error);

        return res.status(500).json({
            status: "error",
            message: "Unable to redirect URL"
        });

    } finally {

        // Release database connection
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    redirectUrl
};