const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'bdhzgmfvp8dzm0yxl3lq-mysql.services.clever-cloud.com',   // Your MySQL host (usually localhost)
    user: 'uv9jrnp0b36lipeq',        // Your MySQL username (change if necessary)
    password: 'bSyLBsxQEnkHjmQPKdqD', // Your MySQL password
    database: 'bdhzgmfvp8dzm0yxl3lq',  // Your MySQL database name
    waitForConnections: true,
    connectionLimit: 10,  // You can adjust the limit based on your needs
    queueLimit: 0
});

module.exports = pool.promise();  // Export pool with promise support for async/await
