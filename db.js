const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,  // You can adjust the limit based on your needs
    queueLimit: 0
});

module.exports = pool.promise();  // Export pool with promise support for async/await
