const express = require('express');
const router = express.Router();
const knex = require('../database');

router.get('/', async (req, res) => {
  let meals = knex.select('meal.*').from('meal');

  if ('maxPrice' in req.query) {
    meals = meals.whereBetween('price', [0, req.query.maxPrice]);
  }

  if ('availableReservations' in req.query) {
    meals = meals
      .join('reservation', 'reservation.meal_id', '=', 'meal.id')
      .groupBy('meal.id');
    if (req.query.availableReservations === 'true') {
      meals = meals.having(
        'meal.max_reservations',
        '>',
        knex.raw('SUM(reservation.number_of_guests)')
      );
    } else {
      meals = meals.having(
        'meal.max_reservations',
        '=',
        knex.raw('SUM(reservation.number_of_guests)')
      );
    }
  }

  if ('title' in req.query) {
    meals = meals.whereRaw('LOWER(title) LIKE ?', [`%${req.query.title}%`]);
  }

  if ('dateAfter' in req.query) {
    meals = meals.whereRaw('`when` > ?', [req.query.dateAfter]);
  }

  if ('dateBefore' in req.query) {
    meals = meals.whereRaw('`when` < ?', [req.query.dateBefore]);
  }

  if ('limit' in req.query) {
    meals = meals.limit(req.query.limit);
  }

  if (
    'sort_key' in req.query &&
    ['when', 'max_reservations', 'price'].includes(req.query.sort_key)
  ) {
    if (
      'sort_dir' in req.query &&
      ['asc', 'desc'].includes(req.query.sort_dir)
    ) {
      meals = meals.orderBy(req.query.sort_key, req.query.sort_dir);
    } else {
      meals = meals.orderBy(req.query.sort_key);
    }
  }

  console.log('SQL', meals.toSQL().sql);

  try {
    const mealsResponse = await meals;

    if (mealsResponse.length !== 0) {
      res.json(mealsResponse);
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

router.get('/:meal_id/reviews', async (req, res) => {
  const mealId = req.params.meal_id;
  const query = knex
    .select('review.*')
    .from('review')
    .join('meal', 'review.meal_id', '=', `meal.id`)
    .having('meal_id', '=', mealId);

  console.log('SQL', query.toSQL().sql);

  try {
    const reviews = await query;
    if (reviews.length !== 0) {
      res.json(reviews);
    } else {
      res.status(404).json({ error: 'No reviews found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
