const express = require('express');

const router = express.Router();
const User = require('../models').User;
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

// Return the list of users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  const userResult = await User.findOne({
    where: {
      emailAddress: user.emailAddress
    },
    attributes: {
      
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  });

  res.json(userResult);
}));

// Create a user
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201)
      .location('/')
      .end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors: errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}));


// Update an existing user
router.put("/users/:id", authenticateUser, asyncHandler(async (req, res, next) => {
  const authenticatedUser = req.currentUser;
  const { id } = req.params;
  
  try {
    const targetUser = await User.findByPk(id);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (parseInt(id) !== authenticatedUser.id) {
      return res.status(403).json({ error: 'You are not authorized to update this user' });
    }

    // Only update fields that are provided in the request body
    const updatableFields = ['designation', 'firstName', 'lastName', 'affiliation', 'areasOfInterest', 'homepage', 'emailAddress', 'password'];
    const updates = {};
    
    updatableFields.forEach(field => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    await targetUser.update(updates);
    res.status(204).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      next(error);
    }
  }
}));



module.exports = router;

