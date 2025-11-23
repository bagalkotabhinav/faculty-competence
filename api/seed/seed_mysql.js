'use strict';

const {
  User,
  Course,
  Event,
  Journal,
  Conference,
  Book,
  Patent,
  sequelize
} = require('../models');

const data = require('./data.json');

(async () => {
  try {
    await sequelize.sync({ force: true });  // DROP + CREATE

    await User.bulkCreate(data.users, { individualHooks: true });

    await Course.bulkCreate(data.courses);

    await Event.bulkCreate(data.events);

    await Journal.bulkCreate(data.journals);

    await Conference.bulkCreate(data.conferences);

    await Book.bulkCreate(data.books);

    await Patent.bulkCreate(data.patents);

    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
