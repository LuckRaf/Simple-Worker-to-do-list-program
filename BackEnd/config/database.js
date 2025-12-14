const mysql = require('mysql2');

// Konfigurasi MySQL Lokal (phpMyAdmin)
const config = {
    host: 'localhost',
    user: 'root',          // default phpMyAdmin
    password: '',          // kosong jika default XAMPP/Laragon
    database: 'kanban_project',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(config);

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    connection.release();
});

// Promise-based pool
module.exports = pool.promise();
