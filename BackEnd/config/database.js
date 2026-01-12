const mysql = require('mysql2');
require('dotenv').config(); // load env

// Pakai DATABASE_URL
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to Railway MySQL ✅');
    connection.release();
});

// Promise-based pool
module.exports = pool.promise();
