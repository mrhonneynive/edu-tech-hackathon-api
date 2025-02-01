const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = require('pg');
const config = require('./app/config');

const pool = new Pool({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB,
});

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));

app.get('/', (req, res) => {
  res.send('api running');
});

app.get('/flashcards/:subject/:userId', (req, res) => {
  const { subject, userId } = req.params;
  pool.query('SELECT * FROM flashcards WHERE subject = ? AND user_id = ?', [subject, userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(port, () => console.log(`API listening on port ${port}`));