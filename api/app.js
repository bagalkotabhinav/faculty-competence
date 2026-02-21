// Load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const cors = require('cors');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Import routes
const loginRouter = require('./routes/login');
const userRouter = require('./routes/users');
const courseRouter = require('./routes/courses');
const eventRouter = require('./routes/events');
const journalRouter = require('./routes/journals'); 
const conferenceRouter = require('./routes/conferences'); 
const bookRouter = require('./routes/books'); 
const patentRouter = require('./routes/patents'); 
// Create the Express app
const app = express();

// Setup morgan for HTTP request logging
app.use(morgan('dev'));

// Setup CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Setup Express to work with JSON
app.use(express.json());

// Setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Faculty Competence Management System!',
  });
});

// Add routes
app.use('/api', loginRouter); 
app.use('/api', userRouter);
app.use('/api', courseRouter);
app.use('/api', eventRouter); 
app.use('/api', journalRouter); 
app.use('/api', conferenceRouter); 
app.use('/api', bookRouter); 
app.use('/api', patentRouter); 

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
