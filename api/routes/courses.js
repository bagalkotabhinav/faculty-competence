const express = require('express');

const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');

const COURSE_FIELDS = ['title', 'description', 'estimatedTime', 'materialsNeeded'];

const pick = (body, fields) => {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
};

// Return all courses
router.get('/courses', authenticateJwt, asyncHandler(async (req, res) => {
  let courses = await Course.findAll({
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
  res.json(courses);
}));

// Return a specific course
router.get('/courses/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const course = await Course.findOne({
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
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({
      "error": "Sorry, we couldn't find the course you were looking for."
    });
  }
}));

// Create a course
router.post('/courses', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const payload = pick(req.body, COURSE_FIELDS);
    payload.userid = req.currentUser.id;
    const newCourse = await Course.create(payload);
    res.status(201)
      .location(`/courses/${newCourse.dataValues.id}`)
      .end();
  } catch (error) {
    console.log('ERROR: ', error.name);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Update an existing course
router.put("/courses/:id", authenticateJwt, asyncHandler(async (req, res, next) => {
  let course;
  try {
    course = await Course.findOne(
      {
        where: { id: req.params.id, userid: req.currentUser.id }
      }
    );
    if (course) {
      const updates = pick(req.body, COURSE_FIELDS);
      await course.update(updates);
      res.status(204).end();
    } else {
      const err = new Error(`Course Not Found`);
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

// Delete an existing course
router.delete("/courses/:id", authenticateJwt, asyncHandler(async (req, res, next) => {
  const course = await Course.findOne(
    {
      where: { id: req.params.id, userid: req.currentUser.id }
    }
  );
  if (course) {
    await course.destroy();
    res.status(204).end();
  } else {
    const err = new Error(`Course Not Found`);
    res.status(404).json({ error: err.message });
  }
}));



module.exports = router;

