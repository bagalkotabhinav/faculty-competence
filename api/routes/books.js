const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const User = require('../models').User;
// const { authenticateUser } = require('../middleware/auth-user');
const { authenticateJwt } = require('../middleware/auth-jwt');
const { asyncHandler } = require('../middleware/async-handler');

const BOOK_FIELDS = ['title', 'authors', 'publicationDate', 'volume', 'pages'];

const pick = (body, fields) => {
  const out = {};
  for (const f of fields) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
};

// Return all books
router.get('/books', authenticateJwt, asyncHandler(async (req, res) => {
  let books = await Book.findAll({
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
  res.json(books);
}));

// Return a specific book
router.get('/books/:id', authenticateJwt, asyncHandler(async (req, res) => {
  const book = await Book.findOne({
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
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({
      "error": "Sorry, we couldn't find the book you were looking for."
    });
  }
}));

// Create a new book
router.post('/books', authenticateJwt, asyncHandler(async (req, res) => {
  try {
    const payload = pick(req.body, BOOK_FIELDS);
    payload.userid = req.currentUser.id;
    const newBook = await Book.create(payload);
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
router.put("/books/:id", authenticateJwt, asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findOne(
      {
        where: { id: req.params.id, userid: req.currentUser.id }
      }
    );
    if (book) {
      const updates = pick(req.body, BOOK_FIELDS);
      await book.update(updates);
      res.status(204).end();
    } else {
      const err = new Error(`Book Not Found`);
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

// Delete an existing book
router.delete("/books/:id", authenticateJwt, asyncHandler(async (req, res) => {
  const book = await Book.findOne(
    {
      where: { id: req.params.id, userid: req.currentUser.id }
    }
  );
  if (book) {
    await book.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Book Not Found' });
  }
}));

module.exports = router;