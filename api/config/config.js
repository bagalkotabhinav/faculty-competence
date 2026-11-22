const fs = require('fs');
const path = require('path');
const runtime = require('./runtime');
const db = runtime.database;

const dialectOptions = db.ssl
  ? {
      ssl: {
        ca: fs.readFileSync(path.resolve(db.sslCaPath), 'utf8'),
        rejectUnauthorized: true
      }
    }
  : {};

module.exports = {
  username: db.user,
  password: db.password,
  database: db.name,
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: db.logging ? console.log : false,
  pool: db.pool,
  dialectOptions
};
