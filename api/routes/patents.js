const express = require('express');
const router = express.Router();
const Patent = require('../models').Patent;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');

// Return all patents
router.get('/patents', authenticateJwt, asyncHandler(async (req, res) => {
  let patents = await Patent.findAll({
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
  res.json(patents);
}));

// Return a specific patent
router.get('/patents/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const patent = await Patent.findByPk(req.params.id, {
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
  if (patent) {
    res.json(patent);
  } else {
    res.status(404).json({
      "error": "Sorry, we couldn't find the patent you were looking for."
    });
  }
}));

// Create a new patent
router.post('/patents', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const newPatent = await Patent.create(req.body);
    res.status(201)
      .location(`/patents/${newPatent.id}`)
      .end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Update an existing patent
router.put("/patents/:id", authenticateJwt, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let patent = await Patent.findByPk(req.params.id);
  if (patent) {
    if (patent.userid === user.id) {
      try {
        await patent.update(req.body);
        res.status(204).end();
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
    } else {
      res.status(403).json({ error: 'You are not authorized to update this patent.' });
    }
  } else {
    res.status(404).json({ error: 'Patent Not Found' });
  }
}));

// Delete an existing patent
router.delete("/patents/:id", authenticateJwt, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const patent = await Patent.findByPk(req.params.id);
  if (patent) {
    if (patent.userid === user.id) {
      await patent.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'You are not authorized to delete this patent.' });
    }
  } else {
    res.status(404).json({ error: 'Patent Not Found' });
  }
}));

module.exports = router;