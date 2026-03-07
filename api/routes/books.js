const createResourceRouter = require('./resourceFactory');
const { Book } = require('../models');

const BOOK_FIELDS = [
  'title',
  'authors',
  'publicationDate',
  'volume',
  'pages'
];

module.exports = createResourceRouter('books', Book, BOOK_FIELDS);