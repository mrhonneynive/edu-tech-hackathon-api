const express = require('express');
// const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));

app.get('/', (req, res) => {
  res.send('api running');
});