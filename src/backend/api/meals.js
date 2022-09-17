const express = require('express');
const router = express.Router();
const knex = require('../database');

router.get('/', async (req, res) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const meals = await knex.select().from('meal');

    if (meals.length !== 0) {
      res.json(meals);
    } else {
      res.status(404).json({ error: 'No meals found' });
    }
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req, res) => {
  try {
    const newMeal = req.body;

    await knex.insert(newMeal).into('meal');
    const meals = await knex.select().from('meal');

    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await knex.select().from('meal').where({ id: mealId });

    if (meal.length !== 0) {
      res.json(meal[0]);
    } else {
      res.status(404).json({ error: 'No meal found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const mealBody = req.body;
    const mealId = req.params.id;

    const meal = await knex('meal').where({ id: mealId });

    if (meal.length === 0) {
      res.status(400).json({ error: 'No meal found' });
    }

    if (Object.keys(mealBody).length !== 0) {
      await knex('meal').where({ id: mealId }).update(mealBody);
      const updatedMeal = await knex('meal').where({ id: mealId });

      res.json(updatedMeal[0]);
    } else {
      res.status(400).json({ error: 'Meal has nothing to update' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await knex('meal').where({ id: mealId });

    if (meal.length === 0) {
      res.status(400).json({ error: 'No meal found' });
    }

    await knex('meal').where({ id: mealId }).del();

    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
