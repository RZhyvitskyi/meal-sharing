const express = require('express');
const router = express.Router();
const knex = require('../database');

router.get('/', async (req, res) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const reservations = await knex.select().from('reservation');

    if (reservations.length !== 0) {
      res.json(reservations);
    } else {
      res.status(404).json({ error: 'No reservations found' });
    }
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req, res) => {
  try {
    const newReservation = req.body;

    await knex.insert(newReservation).into('reservation');
    const reservations = await knex.select().from('reservation');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await knex
      .select()
      .from('reservation')
      .where({ meal_id: reservationId });

    if (reservation.length !== 0) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: 'No reservation found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const reservationBody = req.body;
    const reservationId = req.params.id;

    const reservation = await knex('reservation').where({ id: reservationId });

    if (reservation.length === 0) {
      res.status(400).json({ error: 'No reservation found' });
    }

    if (Object.keys(reservationBody).length !== 0) {
      await knex('reservation')
        .where({ id: reservationId })
        .update(reservationBody);
      const updatedReservation = await knex('reservation').where({
        id: reservationId,
      });

      res.json(updatedReservation[0]);
    } else {
      res.status(400).json({ error: 'Reservation has nothing to update' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await knex('reservation').where({ id: reservationId });

    if (reservation.length === 0) {
      res.status(400).json({ error: 'No reservation found' });
    }

    await knex('reservation').where({ id: reservationId }).del();

    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
