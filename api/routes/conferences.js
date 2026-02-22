const express = require('express');
const router = express.Router();
const Conference = require('../models').Conference;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');

const CONFERENCE_FIELDS = ['title', 'authors', 'publicationDate', 'conference', 'volume', 'issue', 'pages'];

const pick = (body, fields) => {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
};

// Return all conferences
router.get('/conferences', authenticateJwt, asyncHandler(async (req, res) => {
  let conferences = await Conference.findAll({
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
  res.json(conferences);
}));

// Return a specific conference
router.get('/conferences/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const conference = await Conference.findOne({
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
  if (conference) {
    res.json(conference);
  } else {
    res.status(404).json({
      "error": "Sorry, we couldn't find the conference you were looking for."
    });
  }
}));

// Create a new conference
router.post('/conferences', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const payload = pick(req.body, CONFERENCE_FIELDS);
    payload.userid = req.currentUser.id;
    const newConference = await Conference.create(payload);
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
  let conference;
  try {
    conference = await Conference.findOne(
      {
        where: { id: req.params.id, userid: req.currentUser.id }
      }
    );
    if (conference) {
      const updates = pick(req.body, CONFERENCE_FIELDS);
      await conference.update(updates);
      res.status(204).end();
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
  const conference = await Conference.findOne(
    {
      where: { id: req.params.id, userid: req.currentUser.id }
    }
  );
  if (conference) {
    await conference.destroy();
    res.status(204).end();
  } else {
    const err = new Error(`Conference Not Found`);
    res.status(404).json({ error: err.message });
  }
}));

module.exports = router;
