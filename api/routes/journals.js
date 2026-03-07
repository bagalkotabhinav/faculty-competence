const createResourceRouter = require('./resourceFactory');
const { Journal } = require('../models');

const JOURNAL_FIELDS = [
  'title',
  'authors',
  'publicationDate',
  'journal',
  'volume',
  'issue',
  'pages',
  'publisher'
];

module.exports = createResourceRouter('journals', Journal, JOURNAL_FIELDS);