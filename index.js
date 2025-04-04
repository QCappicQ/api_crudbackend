const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // ใช้ promise-based MySQL
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ใช้ connection pool
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10 // จำกัดจำนวน connection
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello world');
});

// ดึงข้อมูลทั้งหมดจาก Recipes
app.get('/Recipes', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM Recipes');
        res.json(results);
    } catch (err) {
        console.error('Error in GET /Recipes:', err);
        res.status(500).json({ error: 'Error retrieving Recipes' });
    }
});

// ดึงข้อมูลจาก Recipes ตาม id
app.get('/Recipes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    try {
        const [results] = await pool.execute('SELECT * FROM Recipes WHERE id = ?', [id]);
        if (results.length === 0) return res.status(404).json({ error: 'Recipe not found' });

        res.json(results[0]);
    } catch (err) {
        console.error(`Error in GET /Recipes/${id}:`, err);
        res.status(500).json({ error: 'Error retrieving Recipe' });
    }
});

// เพิ่มข้อมูลใน Recipes
app.post('/Recipes', async (req, res) => {
    const { name, description, category, instructions, picture1 } = req.body;
    if (!name || !category || !picture1) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [results] = await pool.execute(
            'INSERT INTO Recipes (name, description, category, instructions, picture1) VALUES (?, ?, ?, ?, ?)',
            [name, description, category, instructions, picture1]
        );
        res.status(201).json({ id: results.insertId, message: 'Recipe added successfully' });
    } catch (err) {
        console.error('Error in POST /Recipes:', err);
        res.status(500).json({ error: 'Error adding Recipe' });
    }
});

// อัปเดตข้อมูลใน Recipes ตาม id
app.put('/Recipes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, category, instructions, picture1 } = req.body;
    if (isNaN(id) || !name || !category || !picture1) {
        return res.status(400).json({ error: 'Invalid ID or missing required fields' });
    }

    try {
        const [results] = await pool.execute(
            'UPDATE Recipes SET name=?, description=?, category=?, instructions=?, picture1=? WHERE id=?',
            [name, description, category, instructions, picture1, id]
        );
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Recipe not found' });

        res.json({ message: 'Recipe updated successfully' });
    } catch (err) {
        console.error(`Error in PUT /Recipes/${id}:`, err);
        res.status(500).json({ error: 'Error updating Recipe' });
    }
});

// ลบข้อมูลจาก Recipes ตาม id
app.delete('/Recipes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    try {
        const [results] = await pool.execute('DELETE FROM Recipes WHERE id=?', [id]);
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Recipe not found' });

        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.error(`Error in DELETE /Recipes/${id}:`, err);
        res.status(500).json({ error: 'Error deleting Recipe' });
    }
});

// ดึงข้อมูลทั้งหมดจาก Ingredients
app.get('/Ingredients', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM Ingredients');
        res.json(results);
    } catch (err) {
        console.error('Error in GET /Ingredients:', err);
        res.status(500).json({ error: 'Error retrieving Ingredients' });
    }
});

// เพิ่มข้อมูลใน Ingredients
app.post('/Ingredients', async (req, res) => {
    const { name, calories, unit } = req.body;
    if (!name || !unit) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [results] = await pool.execute(
            'INSERT INTO Ingredients (name, calories, unit) VALUES (?, ?, ?)',
            [name, calories, unit]
        );
        res.status(201).json({ id: results.insertId, message: 'Ingredient added successfully' });
    } catch (err) {
        console.error('Error in POST /Ingredients:', err);
        res.status(500).json({ error: 'Error adding Ingredient' });
    }
});

// ลบข้อมูลจาก Ingredients ตาม id
app.delete('/Ingredients/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    try {
        const [results] = await pool.execute('DELETE FROM Ingredients WHERE id=?', [id]);
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Ingredient not found' });

        res.json({ message: 'Ingredient deleted successfully' });
    } catch (err) {
        console.error(`Error in DELETE /Ingredients/${id}:`, err);
        res.status(500).json({ error: 'Error deleting Ingredient' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CORS-enabled web server listening on port ${PORT}`);
});

// Export app for Vercel
module.exports = app;
