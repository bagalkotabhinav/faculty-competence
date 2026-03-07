const express = require('express');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models');

const pick = (body, fields) => {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
};

const createResourceRouter = (resourceName, Model, allowedFields) => {

  const router = express.Router();

  // GET all
  router.get(`/${resourceName}`, authenticateJwt, asyncHandler(async (req, res) => {

    const items = await Model.findAll({
      where: { userid: req.currentUser.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      }
    });

    res.json(items);

  }));


  // GET one
  router.get(`/${resourceName}/:id`, authenticateJwt, asyncHandler(async (req, res) => {

    const item = await Model.findOne({
      where: { id: req.params.id, userid: req.currentUser.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      }
    });

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: `${resourceName.slice(0,-1)} not found` });
    }

  }));


  // CREATE
  router.post(`/${resourceName}`, authenticateJwt, asyncHandler(async (req, res) => {

    try {

      const payload = pick(req.body, allowedFields);
      payload.userid = req.currentUser.id;

      const newItem = await Model.create(payload);

      res.status(201)
        .location(`/${resourceName}/${newItem.id}`)
        .end();

    } catch (error) {

      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {

        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });

      } else {

        throw error;

      }

    }

  }));


  // UPDATE
  router.put(`/${resourceName}/:id`, authenticateJwt, asyncHandler(async (req, res) => {

    const item = await Model.findOne({
      where: { id: req.params.id, userid: req.currentUser.id }
    });

    if (!item) {
      return res.status(404).json({ error: `${resourceName.slice(0,-1)} not found` });
    }

    try {

      const updates = pick(req.body, allowedFields);

      await item.update(updates);

      res.status(204).end();

    } catch (error) {

      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {

        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });

      } else {

        throw error;

      }

    }

  }));


  // DELETE
  router.delete(`/${resourceName}/:id`, authenticateJwt, asyncHandler(async (req, res) => {

    const item = await Model.findOne({
      where: { id: req.params.id, userid: req.currentUser.id }
    });

    if (!item) {
      return res.status(404).json({ error: `${resourceName.slice(0,-1)} not found` });
    }

    await item.destroy();

    res.status(204).end();

  }));


  return router;

};

module.exports = createResourceRouter;