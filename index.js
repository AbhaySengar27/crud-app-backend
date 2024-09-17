const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',   // Your MySQL host (usually localhost)
    user: 'root',        // Your MySQL username (change if necessary)
    password: 'Abhsen123+', // Your MySQL password
    database: 'test'  // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Create a new user (POST)
app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;
    const sqlInsert = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    db.query(sqlInsert, [name, email, age], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ message: 'User added successfully', userId: result.insertId });
    });
});

// Read all users (GET)
app.get('/api/users', (req, res) => {
    const sqlSelect = 'SELECT * FROM users';
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result);
    });
});

// Update a user by ID (PUT)
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const sqlUpdate = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
    db.query(sqlUpdate, [name, email, age, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Delete a user by ID (DELETE)
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM users WHERE id = ?';
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Server listen on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
