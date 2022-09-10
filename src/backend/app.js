const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const knex = require('./database');

const mealsRouter = require('./api/meals');
const buildPath = path.join(__dirname, '../../dist');
const port = process.env.PORT || 3000;
const cors = require('cors');

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use('/meals', mealsRouter);

app.get('/future-meals', async (req, res) => {
  const dbResult = await knex.raw(`SELECT * FROM meal WHERE meal.when > NOW()`);
  const row = dbResult[0];

  res.json(row);
});

app.get('/past-meals', async (req, res) => {
  const dbResult = await knex.raw(`SELECT * FROM meal WHERE meal.when < NOW()`);
  const row = dbResult[0];

  res.json(row);
});

app.get('/all-meals', async (req, res) => {
  const dbResult = await knex.raw(`SELECT * FROM meal`);
  const row = dbResult[0];

  res.json(row);
});

app.get('/first-meal', async (req, res) => {
  try {
    const dbResult = await knex.raw(`SELECT * FROM meal LIMIT 1`);
    const row = dbResult[0][0];

    if (row) {
      res.json(row);
    } else {
      throw new Error('No meals found');
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
});

app.get('/last-meal', async (req, res) => {
  try {
    const dbResult = await knex.raw(
      `SELECT * FROM meal ORDER BY meal.id DESC LIMIT 1`
    );
    const row = dbResult[0][0];

    if (row) {
      res.json(row);
    } else {
      throw new Error('No meals found');
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw 'API_PATH is not set. Remember to set it in your .env file';
}

// for the frontend. Will first be covered in the react class
app.use('*', (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;
