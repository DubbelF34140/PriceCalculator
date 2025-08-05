const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
var app = express();

const PORT = process.env.PORT || 8000;
const DBURI =
  process.env.NODE_ENV === 'production'
    ? process.env.DBURI_PROD
    : process.env.DBURI_DEV;

var options = { index: 'myWebPage.html' };
var dir = path.join(__dirname, '../front');

app.use(express.json()); 
app.use(express.static(dir, options));

let db; 

async function connectToDatabase() {
  try {
    const client = new MongoClient(DBURI, { useUnifiedTopology: true });
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connecté à MongoDB avec succès !');

    db = client.db();
  } catch (error) {
    console.error('Erreur de connexion MongoDB :', error);
    process.exit(1); 
  }
}

app.get('/api', (req, res) => {
  res.send('Yes we have an API now');
});

app.get('/api/price', (req, res) => {
  const s = parseFloat(req.query.salary) || 30000;
  const d = parseFloat(req.query.days) || 1;
  const dailyRate = s / 365;
  const price = dailyRate * d;
  const roundToNearest = 50;
  const roundedPrice =
    Math.round((price + roundToNearest / 2) / roundToNearest) *
    roundToNearest;

  res.send(roundedPrice.toString());
});

app.post('/api/saveQuote', async (req, res) => {
  const { quoteName, salary, days } = req.body;

  if (!quoteName || !salary || !days) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const result = await db.collection('quotes').insertOne({
      quoteName,
      salary,
      days,
      createdAt: new Date(),
    });

    res.json({ message: 'Quote saved', id: result.insertedId });
  } catch (err) {
    console.error('Erreur insertion DB :', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await db.collection('quotes')
      .find({})
      .sort({ createdAt: -1 }) // du plus récent au plus ancien
      .toArray();
    res.json(quotes);
  } catch (err) {
    console.error('Erreur récupération devis :', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.use((req, res) => {
  res.status(404).send('This page does not exist!');
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
});