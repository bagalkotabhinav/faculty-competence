'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const cors = require('cors');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Import routes
const userRouter = require('./routes/users');
const courseRouter = require('./routes/courses');
const eventRouter = require('./routes/events'); // Import the events router
const journalRouter = require('./routes/journals'); // Import the events router
const conferenceRouter = require('./routes/conferences'); // Import the events router
const bookRouter = require('./routes/books'); // Import the books router
const patentRouter = require('./routes/patents'); // Import the patents router
// Create the Express app
const app = express();

// Setup morgan for HTTP request logging
app.use(morgan('dev'));

// Setup CORS
app.use(cors());

// Setup Express to work with JSON
app.use(express.json());

// Setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Add routes
app.use('/api', userRouter);
app.use('/api', courseRouter);
app.use('/api', eventRouter); // Add events route
app.use('/api', journalRouter); // Add events route
app.use('/api', conferenceRouter); // Add events route
app.use('/api', bookRouter); // Add books route
app.use('/api', patentRouter); // Add patents route

// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set our port
app.set('port', process.env.PORT || 5000);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();

// Start listening on our port
sequelize.sync()
  .then(() => {
    const server = app.listen(app.get('port'), () => {
      console.log(`Express server is listening on port ${server.address().port}`);
    });
  });
