// api/routes/resources.js
const express = require('express');
const router = express.Router();
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');
const db = require('../models');

const resources = {
  courses: db.Course,
  events: db.Event,
  journals: db.Journal,
  conferences: db.Conference,
  books: db.Book,
  patents: db.Patent,
};

// Allowlisted fields per resource — ONLY these can be written
const allowedFields = {
  courses: ['title', 'description', 'estimatedTime', 'materialsNeeded'],
  events: ['title', 'description', 'eventType', 'participationType', 'eventDate', 'location'],
  journals: ['title', 'authors', 'publicationDate', 'journal', 'volume', 'issue', 'pages', 'publisher'],
  conferences: ['title', 'authors', 'publicationDate', 'conference', 'volume', 'issue', 'pages'],
  books: ['title', 'authors', 'publicationDate', 'volume', 'pages'],
  patents: ['title', 'inventors', 'publicationDate', 'patentOffice', 'patentNumber', 'applicationNumber'],
};

function pickFields(type, body) {
  const fields = allowedFields[type] || [];
  return Object.fromEntries(
    Object.entries(body).filter(([k]) => fields.includes(k))
  );
}

/* GET ALL — own records only */
router.get('/resources/:type', authenticateJwt, asyncHandler(async (req, res) => {
  const Model = resources[req.params.type];
  if (!Model) return res.status(404).json({ message: 'Invalid resource type' });

  const items = await Model.findAll({ where: { userid: req.currentUser.id } });
  res.json(items);
}));

/* GET ONE — own record only */
router.get('/resources/:type/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const Model = resources[req.params.type];
  if (!Model) return res.status(404).json({ message: 'Invalid resource type' });

  const item = await Model.findOne({
    where: { id: req.params.id, userid: req.currentUser.id }
  });
  if (!item) return res.status(404).json({ message: 'Not found' });

  res.json(item);
}));

/* CREATE — userid always comes from the JWT, not the body */
router.post('/resources/:type', authenticateJwt, asyncHandler(async (req, res) => {
  const Model = resources[req.params.type];
  if (!Model) return res.status(404).json({ message: 'Invalid resource type' });

  const safe = pickFields(req.params.type, req.body);

  try {
    const newItem = await Model.create({ ...safe, userid: req.currentUser.id });
    res.status(201).location(`/resources/${req.params.type}/${newItem.id}`).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ errors: error.errors.map(e => e.message) });
    }
    throw error;
  }
}));

/* UPDATE — strip to allowlist, then verify ownership */
router.put('/resources/:type/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const Model = resources[req.params.type];
  if (!Model) return res.status(404).json({ message: 'Invalid resource type' });

  const item = await Model.findOne({
    where: { id: req.params.id, userid: req.currentUser.id }
  });
  if (!item) return res.status(404).json({ message: 'Not found' });

  const safe = pickFields(req.params.type, req.body);

  try {
    await item.update(safe);
    res.status(204).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ errors: error.errors.map(e => e.message) });
    }
    throw error;
  }
}));

/* DELETE — own record only */
router.delete('/resources/:type/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const Model = resources[req.params.type];
  if (!Model) return res.status(404).json({ message: 'Invalid resource type' });

  const item = await Model.findOne({
    where: { id: req.params.id, userid: req.currentUser.id }
  });
  if (!item) return res.status(404).json({ message: 'Not found' });

  await item.destroy();
  res.status(204).end();
}));

module.exports = router;