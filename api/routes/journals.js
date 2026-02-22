const express = require('express');
const router = express.Router();
const Journal = require('../models').Journal;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');

// Return all journals
router.get('/journals', authenticateJwt, asyncHandler(async (req, res) => {
  let journals = await Journal.findAll({
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
  res.json(journals);
}));

// Return a specific journal
router.get('/journals/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const journal = await Journal.findByPk(req.params.id, {
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
  if (journal) {
    res.json(journal);
  } else {
    res.json({
      "error": "Sorry, we couldn't find the journal you were looking for."
    });
  }
}));

// Create a new journal
router.post('/journals', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const newJournal = await Journal.create(req.body);
    res.status(201)
      .location(`/journals/${newJournal.dataValues.id}`)
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

// Update an existing journal
router.put('/journals/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let journal;
  try {
    journal = await Journal.findByPk(req.params.id);
    if (journal) {
      if (journal.userid === user.id) {
        await journal.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ error: 'You are not authorised to update this journal.' });
      }
    } else {
      res.status(404).json({ error: 'Journal not found' });
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

// Delete an existing journal
router.delete('/journals/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const journal = await Journal.findByPk(req.params.id);
  if (journal) {
    if (journal.userid === user.id) {
      await journal.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'You are not authorised to delete this journal.' });
    }
  } else {
    res.status(404).json({ error: 'Journal not found' });
  }
}));

module.exports = router;
