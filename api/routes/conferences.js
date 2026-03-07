const createResourceRouter = require('./resourceFactory');
const { Conference } = require('../models');

const CONFERENCE_FIELDS = [
  'title',
  'authors',
  'publicationDate',
  'conference',
  'volume',
  'issue',
  'pages'
];

module.exports = createResourceRouter('conferences', Conference, CONFERENCE_FIELDS);