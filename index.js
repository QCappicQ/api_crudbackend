const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection(process.env.DATABASE_URL);

app.get('/', (req, res) => {
    res.send('Hello world');
});

// ดึงข้อมูลทั้งหมดจาก Recipes
app.get('/Recipes', (req, res) => {
    connection.query('SELECT * FROM Recipes', function (err, results) {
        if (err) {
            console.error('Error in GET /Recipes:', err);
            res.status(500).send('Error retrieving Recipes');
        } else {
            res.send(results);
        }
    });
});

// ดึงข้อมูลจาก Recipes ตาม id
app.get('/Recipes/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM Recipes WHERE id = ?', [id], function (err, results) {
        if (err) {
            console.error(`Error in GET /Recipes/${id}:`, err);
            res.status(500).send('Error retrieving Recipe');
        } else {
            res.send(results);
        }
    });
});

// เพิ่มข้อมูลใน Recipes
app.post('/Recipes', (req, res) => {
    connection.query('INSERT INTO Recipes (name, description, category, instructions, picture1) VALUES (?, ?, ?, ?, ?)', 
        [req.body.name, req.body.description, req.body.category, req.body.instructions, req.body.picture1], 
        function (err, results) {
            if (err) {
                console.error('Error in POST /Recipes:', err);
                res.status(500).send('Error adding Recipe');
            } else {
                res.status(201).json({ id: results.insertId, message: 'Recipe added successfully' });
            }
        }
    );
});

// อัปเดตข้อมูลใน Recipes ตาม id
app.put('/Recipes/:id', (req, res) => {
    const id = req.params.id;
    connection.query('UPDATE Recipes SET name=?, description=?, category=?, instructions=?, picture1=? WHERE id=?', 
        [req.body.name, req.body.description, req.body.category, req.body.instructions, req.body.picture1, id], 
        function (err, results) {
            if (err) {
                console.error(`Error in PUT /Recipes/${id}:`, err);
                res.status(500).send('Error updating Recipe');
            } else {
                res.send({ message: 'Recipe updated successfully' });
            }
        }
    );
});

// ลบข้อมูลจาก Recipes ตาม id
app.delete('/Recipes/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM Recipes WHERE id=?', [id], function (err, results) {
        if (err) {
            console.error(`Error in DELETE /Recipes/${id}:`, err);
            res.status(500).send('Error deleting Recipe');
        } else {
            res.send({ message: 'Recipe deleted successfully' });
        }
    });
});

// ดึงข้อมูลทั้งหมดจาก Ingredients
app.get('/Ingredients', (req, res) => {
    connection.query('SELECT * FROM Ingredients', function (err, results) {
        if (err) {
            console.error('Error in GET /Ingredients:', err);
            res.status(500).send('Error retrieving Ingredients');
        } else {
            res.send(results);
        }
    });
});

// ดึงข้อมูลจาก Ingredients ตาม id
app.get('/Ingredients/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM Ingredients WHERE id = ?', [id], function (err, results) {
        if (err) {
            console.error(`Error in GET /Ingredients/${id}:`, err);
            res.status(500).send('Error retrieving Ingredient');
        } else {
            res.send(results);
        }
    });
});

// เพิ่มข้อมูลใน Ingredients
app.post('/Ingredients', (req, res) => {
    connection.query('INSERT INTO Ingredients (name, calories, unit) VALUES (?, ?, ?)', 
        [req.body.name, req.body.calories, req.body.unit], 
        function (err, results) {
            if (err) {
                console.error('Error in POST /Ingredients:', err);
                res.status(500).send('Error adding Ingredient');
            } else {
                res.status(201).json({ id: results.insertId, message: 'Ingredient added successfully' });
            }
        }
    );
});

// อัปเดตข้อมูลใน Ingredients ตาม id
app.put('/Ingredients/:id', (req, res) => {
    const id = req.params.id;
    connection.query('UPDATE Ingredients SET name=?, calories=?, unit=? WHERE id=?', 
        [req.body.name, req.body.calories, req.body.unit, id], 
        function (err, results) {
            if (err) {
                console.error(`Error in PUT /Ingredients/${id}:`, err);
                res.status(500).send('Error updating Ingredient');
            } else {
                res.send({ message: 'Ingredient updated successfully' });
            }
        }
    );
});

// ลบข้อมูลจาก Ingredients ตาม id
app.delete('/Ingredients/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM Ingredients WHERE id=?', [id], function (err, results) {
        if (err) {
            console.error(`Error in DELETE /Ingredients/${id}:`, err);
            res.status(500).send('Error deleting Ingredient');
        } else {
            res.send({ message: 'Ingredient deleted successfully' });
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000');
});

// export the app for vercel serverless functions
module.exports = app;
