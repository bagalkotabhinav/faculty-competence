const express = require('express');
const router = express.Router();
const Conference = require('../models').Conference;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');

// Return all conferences
router.get('/conferences', asyncHandler(async (req, res) => {
  let conferences = await Conference.findAll({
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
  res.json(conferences);
}));

// Return a specific conference
router.get('/conferences/:id', asyncHandler(async (req, res) => {
  const conference = await Conference.findByPk(req.params.id, {
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
  if (conference) {
    res.json(conference);
  } else {
    res.json({
      "error": "Sorry, we couldn't find the conference you were looking for."
    });
  }
}));

// Create a new conference
router.post('/conferences', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const newConference = await Conference.create(req.body);
    res.status(201)
      .location(`/conferences/${newConference.dataValues.id}`)
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

// Update an existing conference
router.put("/conferences/:id", authenticateJwt, asyncHandler(async (req, res, next) => {
  const user = req.currentUser;
  let conference;
  try {
    conference = await Conference.findByPk(req.params.id);
    if (conference) {
      if (conference.userid === user.id) {
        await conference.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ error: 'You are not authorised to update this conference.' });
      }
    } else {
      const err = new Error(`Conference Not Found`);
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

// Delete an existing conference
router.delete("/conferences/:id", authenticateJwt, asyncHandler(async (req, res, next) => {
  const user = req.currentUser;
  const conference = await Conference.findByPk(req.params.id);
  if (conference) {
    if (conference.userid === user.id) {
      await conference.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'You are not authorised to delete this conference.' });
    }
  } else {
    const err = new Error(`Conference Not Found`);
    res.status(404).json({ error: err.message });
  }
}));

module.exports = router;
