const express = require('express');
const router = express.Router();
const Event = require('../models').Event;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');

// Return all events
router.get('/events', authenticateJwt, asyncHandler(async (req, res) => {
  let events = await Event.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: {
      model: User,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    }
  });
  res.json(events);
}));

// Return a specific event
router.get('/events/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const event = await Event.findByPk(req.params.id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: {
      model: User,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    }
  });
  if (event) {
    res.json(event);
  } else {
    res.json({
      "error": "Sorry, we couldn't find the event you were looking for."
    });
  }
}));

router.post('/events', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201)
      .location(`/events/${newEvent.dataValues.id}`)
      .end();
  } catch (error) {
    console.log('ERROR: ', error.name);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}));

// Update an existing event
router.put("/events/:id", authenticateJwt, asyncHandler(async (req, res, next) => {
  const user = req.currentUser;
  let event;
  try {
    event = await Event.findByPk(req.params.id);
    if (event) {
      if (event.userid === user.id) {
        await event.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ error: 'You are not authorised to update this event.' });
      }
    } else {
      const err = new Error(`Event Not Found`);
      res.status(404).json({ error: err.message });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Delete an existing event
router.delete("/events/:id", authenticateJwt, asyncHandler(async (req, res, next) => {
  const user = req.currentUser;
  const event = await Event.findByPk(req.params.id);
  if (event) {
    if (event.userid === user.id) {
      await event.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'You are not authorised to delete this event.' });
    }
  } else {
    const err = new Error(`Event Not Found`);
    res.status(404).json({ error: err.message });
  }
}));


module.exports = router;
