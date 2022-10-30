const express = require('express');
const router = express.Router();
const knex = require('../database');

router.get('/', async (req, res) => {
  const query = knex.select('review.*').from('review');

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

router.post('/', async (req, res) => {
  try {
    const newReview = req.body;

    await knex.insert(newReview).into('review');
    const reviews = await knex.select().from('review');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const reviewId = req.params.id;
  const query = knex.select('review.*').from('review').where({ id: reviewId });

  console.log('SQL', query.toSQL().sql);

  try {
    const review = await query;
    if (review.length !== 0) {
      res.json(review);
    } else {
      res.status(404).json({ error: 'No review found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const reviewBody = req.body;
  const reviewId = req.params.id;

  try {
    const review = await knex('review').where({ id: reviewId });

    if (review.length === 0) {
      res.status(400).json({ error: 'No review found' });
    }

    if (Object.keys(reviewBody).length !== 0) {
      await knex('review').where({ id: reviewId }).update(reviewBody);
      const updatedReview = await knex('review').where({ id: reviewId });

      res.json(updatedReview[0]);
    } else {
      res.status(400).json({ error: 'Review has nothing to update' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await knex('review').where({ id: reviewId });

    if (review.length === 0) {
      res.status(400).json({ error: 'No review found' });
    }

    await knex('review').where({ id: reviewId }).del();

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
