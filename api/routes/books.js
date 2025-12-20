const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const User = require('../models').User;
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

// Return all books
router.get('/books', asyncHandler(async (req, res) => {
  let books = await Book.findAll({
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
  res.json(books);
}));

// Return a specific book
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id, {
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
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({
      "error": "Sorry, we couldn't find the book you were looking for."
    });
  }
}));

// Create a new book
router.post('/books', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201)
      .location(`/books/${newBook.id}`)
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

// Update an existing book
router.put("/books/:id", authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let book = await Book.findByPk(req.params.id);
  if (book) {
    if (book.userid === user.id) {
      try {
        await book.update(req.body);
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
      res.status(403).json({ error: 'You are not authorized to update this book.' });
    }
  } else {
    res.status(404).json({ error: 'Book Not Found' });
  }
}));

// Delete an existing book
router.delete("/books/:id", authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const book = await Book.findByPk(req.params.id);
  if (book) {
    if (book.userid === user.id) {
      await book.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'You are not authorized to delete this book.' });
    }
  } else {
    res.status(404).json({ error: 'Book Not Found' });
  }
}));

module.exports = router;