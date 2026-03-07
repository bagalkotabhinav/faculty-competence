const createResourceRouter = require('./resourceFactory');
const { Event } = require('../models');

const EVENT_FIELDS = [
  'title',
  'description',
  'eventType',
  'participationType',
  'eventDate',
  'location'
];

module.exports = createResourceRouter('events', Event, EVENT_FIELDS);