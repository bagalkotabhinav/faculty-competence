// ===============================
// Imports
// ===============================
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const { sequelize } = require('./models');

const loginRouter = require('./routes/login');
const userRouter = require('./routes/users');
const resourcesRouter = require('./routes/resources');

// ===============================
// Environment Validation        
// ===============================
// api/app.js — replace the existing JWT_SECRET guard with this
const REQUIRED_ENV = ['JWT_SECRET', 'DB_DIALECT'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
// ===============================
// App initialization
// ===============================
const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 5000;
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// ===============================
// Security Middleware
// ===============================
app.use(helmet());
app.use(hpp());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500
});

app.use('/api', apiLimiter);

// ===============================
// General Middleware
// ===============================
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));

// ===============================
// Routes
// ===============================
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Faculty Competence Management System!'
  });
});

app.use('/api', loginRouter);
app.use('/api', userRouter);
app.use('/api', resourcesRouter);

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${err.stack}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// ===============================
// Database + Server Start
// ===============================
let server;

async function startServer() {
  try {

    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Startup error:', error);
  }
}

startServer();

// ===============================
// Graceful Shutdown
// ===============================
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (server) server.close();
  await sequelize.close();
  process.exit(0);
});