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
  patents: db.Patent
};

/* GET ALL */
router.get(
  '/resources/:type',
  authenticateJwt,
  asyncHandler(async (req, res) => {

    const Model = resources[req.params.type];

    if (!Model) {
      return res.status(404).json({ message: "Invalid resource" });
    }

    const items = await Model.findAll({
      where: { userid: req.currentUser.id }
    });

    res.json(items);

  })
);

/* GET ONE */
router.get(
  '/resources/:type/:id',
  authenticateJwt,
  asyncHandler(async (req, res) => {

    const Model = resources[req.params.type];

    const item = await Model.findOne({
      where: {
        id: req.params.id,
        userid: req.currentUser.id
      }
    });

    if (!item) return res.status(404).end();

    res.json(item);

  })
);

/* CREATE */
router.post(
  '/resources/:type',
  authenticateJwt,
  asyncHandler(async (req, res) => {

    const Model = resources[req.params.type];

    const newItem = await Model.create({
      ...req.body,
      userid: req.currentUser.id
    });

    res.status(201).location(`/resources/${req.params.type}/${newItem.id}`).end();

  })
);

/* UPDATE */
router.put(
  '/resources/:type/:id',
  authenticateJwt,
  asyncHandler(async (req, res) => {

    const Model = resources[req.params.type];

    const item = await Model.findOne({
      where: {
        id: req.params.id,
        userid: req.currentUser.id
      }
    });

    if (!item) return res.status(404).end();

    await item.update(req.body);

    res.status(204).end();

  })
);

/* DELETE */
router.delete(
  '/resources/:type/:id',
  authenticateJwt,
  asyncHandler(async (req, res) => {

    const Model = resources[req.params.type];

    const item = await Model.findOne({
      where: {
        id: req.params.id,
        userid: req.currentUser.id
      }
    });

    if (!item) return res.status(404).end();

    await item.destroy();

    res.status(204).end();

  })
);

module.exports = router;