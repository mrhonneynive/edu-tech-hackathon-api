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

app.use(express.json());

app.get('/', (req, res) => {
  res.send('api running');
});

app.get('/flashcards/:subject/:userId', (req, res) => {
  const { subject, userId } = req.params;
  pool.query(
    'SELECT * FROM flashcards WHERE subject = $1 AND user_id = $2',
    [subject, userId],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results.rows);
    }
  );
});

app.put('/flashcards/:flashcardId', (req, res) => {
  const { flashcardId } = req.params;
  const { userId, easeFactor, dueDate } = req.body;
  
  // Including userId in the WHERE clause ensures that only the flashcard 
  // belonging to that user is updated
  pool.query(
    'UPDATE flashcards SET ease_factor = $1, due_date = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
    [easeFactor, dueDate, flashcardId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Flashcard not found or unauthorized access' });
      }
      res.json(result.rows[0]);
    }
  );
});

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));