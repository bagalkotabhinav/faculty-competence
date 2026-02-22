const express = require('express');
const router = express.Router();
const Patent = require('../models').Patent;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');
const PATENT_FIELDS = ['title', 'inventors', 'publicationDate', 'patentOffice', 'patentNumber', 'applicationNumber'];

const pick = (body, fields) => {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
};

// Return all patents
router.get('/patents', authenticateJwt, asyncHandler(async (req, res) => {
  let patents = await Patent.findAll({
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
  res.json(patents);
}));

// Return a specific patent
router.get('/patents/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const patent = await Patent.findOne({
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
    const payload = pick(req.body, PATENT_FIELDS);
    payload.userid = req.currentUser.id;
    const newPatent = await Patent.create(payload);
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
  let patent = await Patent.findOne({
    where: { id: req.params.id, userid: req.currentUser.id }
  });
  if (patent) {
    try {
      const updates = pick(req.body, PATENT_FIELDS);
      await patent.update(updates);
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
    res.status(404).json({ error: 'Patent Not Found' });
  }
}));

// Delete an existing patent
router.delete("/patents/:id", authenticateJwt, asyncHandler(async (req, res) => {
  const patent = await Patent.findOne({
    where: { id: req.params.id, userid: req.currentUser.id }
  });
  if (patent) {
    await patent.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Patent Not Found' });
  }
}));

module.exports = router;
