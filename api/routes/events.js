const express = require('express');
const router = express.Router();
const Event = require('../models').Event;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');
const EVENT_FIELDS = ['title', 'description', 'eventType', 'participationType', 'eventDate', 'location'];

const pick = (body, fields) => {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
};

// Return all events
router.get('/events', authenticateJwt, asyncHandler(async (req, res) => {
  let events = await Event.findAll({
    where: { userid: req.currentUser.id },
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
  const event = await Event.findOne({
    where: { id: req.params.id, userid: req.currentUser.id },
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
    res.status(404).json({
      "error": "Sorry, we couldn't find the event you were looking for."
    });
  }
}));

router.post('/events', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const payload = pick(req.body, EVENT_FIELDS);
    payload.userid = req.currentUser.id;
    const newEvent = await Event.create(payload);
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
router.put("/events/:id", authenticateJwt, asyncHandler(async (req, res) => {
  let event;
  try {
    event = await Event.findOne({
      where: { id: req.params.id, userid: req.currentUser.id }
    });
    if (event) {
      const updates = pick(req.body, EVENT_FIELDS);
      await event.update(updates);
      res.status(204).end();
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
router.delete("/events/:id", authenticateJwt, asyncHandler(async (req, res) => {
  const event = await Event.findOne({
    where: { id: req.params.id, userid: req.currentUser.id }
  });
  if (event) {
    await event.destroy();
    res.status(204).end();
  } else {
    const err = new Error(`Event Not Found`);
    res.status(404).json({ error: err.message });
  }
}));


module.exports = router;
