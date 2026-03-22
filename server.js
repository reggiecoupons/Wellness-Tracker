const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

pool.query(`
  CREATE TABLE IF NOT EXISTS logs (
    date TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/logs', async (req, res) => {
  const { rows } = await pool.query('SELECT date, data FROM logs');
  const result = {};
  rows.forEach(r => { result[r.date] = r.data; });
  res.json(result);
});

app.post('/api/log', async (req, res) => {
  const { date, data } = req.body;
  if (!date || !data) return res.status(400).json({ error: 'missing date or data' });
  await pool.query(
    'INSERT INTO logs (date, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (date) DO UPDATE SET data = $2, updated_at = NOW()',
    [date, data]
  );
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Wellness server running on port ${port}`));
