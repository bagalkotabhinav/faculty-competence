const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

/**
 * POST /login
 *
 * Purpose:
 * - Authenticate user using email + password
 * - Issue JWT on success
 *
 * Request body:
 * {
 *   "emailAddress": "user@example.com",
 *   "password": "password123"
 * }
 *
 * Response (200):
 * {
 *   "user": { ...safe user fields },
 *   "token": "jwt_token_here"
 * }
 */
router.post('/login', async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    // 1. Validate input
    if (!emailAddress || !password) {
      return res.status(400).json({
        message: 'Email address and password are required'
      });
    }

    // 2. Find user by email
    const user = await User.findOne({
      where: { emailAddress }
    });

    if (!user) {
      // Do not reveal which part was incorrect
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // 3. Verify password
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // 4. Create JWT payload
    const payload = {
      sub: user.id
    };

    // 5. Sign JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 6. Return user (safe fields only) + token
    console.log('LOGIN USER PAYLOAD:', {
      areasOfInterest: user.areasOfInterest,
      homepage: user.homepage,
      affiliation: user.affiliation,
      firstName: user.firstName
    });

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        designation: user.designation,
        affiliation: user.affiliation,
        homepage: user.homepage,
        areasOfInterest: user.areasOfInterest
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;
