const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,        // Use environment variables for security
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,  // You can adjust the limit based on your app's requirements
    queueLimit: 0
});

// Use promises for async/await with the pool
const promisePool = pool.promise();

// Create a new user (POST)
app.post('/api/users', async (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const [result] = await promisePool.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age]);
        res.status(200).json({ message: 'User added successfully', userId: result.insertId });
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Server error');
    }
});

// Read all users (GET)
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM users');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Server error');
    }
});

// Update a user by ID (PUT)
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const [result] = await promisePool.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Server error');
    }
});

// Delete a user by ID (DELETE)
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await promisePool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Server error');
    }
});

// Use dynamic port from Render or default to 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
