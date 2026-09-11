const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

let isConnected = false;

// Test database connection immediately on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        isConnected = true;
        console.log(`\x1b[32m✔ [Database] Successfully connected to MySQL database: ${process.env.DB_NAME || 'portfolio_db'} on port ${process.env.DB_PORT || 3306}\x1b[0m`);
        connection.release();
    } catch (error) {
        isConnected = false;
        console.warn(`\x1b[33m⚠ [Database Notice] Unable to connect to MySQL database (${error.code || error.message}).`);
        console.warn(`  To enable persistent MySQL storage, start MySQL in XAMPP or MySQL Server and run database/portfolio.sql.`);
        console.warn(`  The backend will seamlessly operate with fallback data for previewing.\x1b[0m`);
    }
})();

/**
 * Execute parameterized query safely
 * @param {string} sql - SQL statement with placeholders (?)
 * @param {Array} params - Array of parameters to bind
 * @returns {Promise<Array>} Query results
 */
const query = async (sql, params = []) => {
    return pool.execute(sql, params);
};

module.exports = {
    pool,
    query,
    isDbConnected: () => isConnected
};
