const createResourceRouter = require('./resourceFactory');
const { Patent } = require('../models');

const PATENT_FIELDS = [
  'title',
  'inventors',
  'publicationDate',
  'patentOffice',
  'patentNumber',
  'applicationNumber'
];

module.exports = createResourceRouter('patents', Patent, PATENT_FIELDS);