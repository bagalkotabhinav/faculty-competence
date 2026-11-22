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

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run the destructive seed script in production.');
  process.exit(1);
}

if (process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
  console.error('This seed script drops and recreates tables. Set ALLOW_DESTRUCTIVE_SEED=true only for a disposable development database.');
  process.exit(1);
}

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

    await sequelize.close();
  } catch (err) {
    console.error('Seed failed.', { name: err.name, code: err.original?.code || err.parent?.code });
    await sequelize.close().catch(() => {});
    process.exit(1);
  }
})();
