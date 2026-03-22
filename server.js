const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const DB_PATH = process.env.DB_PATH || './wellness.db.json';

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/logs', (req, res) => {
  res.json(loadData());
});

app.post('/api/log', (req, res) => {
  const { date, data } = req.body;
  if (!date || !data) return res.status(400).json({ error: 'missing date or data' });
  const db = loadData();
  db[date] = data;
  saveData(db);
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Wellness server running on port ${port}`));
