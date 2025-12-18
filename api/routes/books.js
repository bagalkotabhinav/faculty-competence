const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

/**
 * GET /books
 * Return ONLY the logged-in user's books
 */
router.get('/books', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  const books = await Book.findAll({
    where: { userid: user.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });

  res.json(books);
}));

/**
 * GET /books/:id
 * Return ONE book only if it belongs to the logged-in user
 */
router.get('/books/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  const book = await Book.findOne({
    where: {
      id: req.params.id,
      userid: user.id
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });

  if (!book) {
    return res.status(404).json({ error: 'Book Not Found' });
  }

  res.json(book);
}));

/**
 * POST /books
 * Create a new book owned by the logged-in user
 */
router.post('/books', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const user = req.currentUser;

    const newBook = await Book.create({
      ...req.body,
      userid: user.id   // FORCE ownership
    });

    res.status(201)
      .location(`/books/${newBook.id}`)
      .json(newBook);

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

/**
 * PUT /books/:id
 * Update a book only if it belongs to the logged-in user
 */
router.put('/books/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  const book = await Book.findOne({
    where: {
      id: req.params.id,
      userid: user.id
    }
  });

  if (!book) {
    return res.status(404).json({ error: 'Book Not Found' });
  }

  try {
    const updatedBook = await book.update({
      ...req.body,
      userid: user.id   // PREVENT ownership change
    });

    res.json(updatedBook);

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

/**
 * DELETE /books/:id
 * Delete a book only if it belongs to the logged-in user
 */
router.delete('/books/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  const book = await Book.findOne({
    where: {
      id: req.params.id,
      userid: user.id
    }
  });

  if (!book) {
    return res.status(404).json({ error: 'Book Not Found' });
  }

  await book.destroy();
  res.status(204).end();
}));

module.exports = router;
