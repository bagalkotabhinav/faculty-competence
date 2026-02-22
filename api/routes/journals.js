const express = require('express');
const router = express.Router();
const Journal = require('../models').Journal;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');
const JOURNAL_FIELDS = ['title', 'authors', 'publicationDate', 'journal', 'volume', 'issue', 'pages', 'publisher'];

const pick = (body, fields) => {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
};

// Return all journals
router.get('/journals', authenticateJwt, asyncHandler(async (req, res) => {
  let journals = await Journal.findAll({
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
  res.json(journals);
}));

// Return a specific journal
router.get('/journals/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({
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
  if (journal) {
    res.json(journal);
  } else {
    res.status(404).json({
      "error": "Sorry, we couldn't find the journal you were looking for."
    });
  }
}));

// Create a new journal
router.post('/journals', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const payload = pick(req.body, JOURNAL_FIELDS);
    payload.userid = req.currentUser.id;
    const newJournal = await Journal.create(payload);
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
  let journal;
  try {
    journal = await Journal.findOne({
      where: { id: req.params.id, userid: req.currentUser.id }
    });
    if (journal) {
      const updates = pick(req.body, JOURNAL_FIELDS);
      await journal.update(updates);
      res.status(204).end();
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
  const journal = await Journal.findOne({
    where: { id: req.params.id, userid: req.currentUser.id }
  });
  if (journal) {
    await journal.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Journal not found' });
  }
}));

module.exports = router;
