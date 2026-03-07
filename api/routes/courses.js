const createResourceRouter = require('./resourceFactory');
const { Course } = require('../models');

const COURSE_FIELDS = [
  'title',
  'description',
  'estimatedTime',
  'materialsNeeded'
];

module.exports = createResourceRouter('courses', Course, COURSE_FIELDS);