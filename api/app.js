const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const { setTimeout: delay } = require('node:timers/promises');
const config = require('./config/runtime');

if (config.missing.length) {
  console.error(JSON.stringify({
    level: 'fatal',
    event: 'missing_configuration',
    variables: config.missing
  }));
  process.exit(1);
}

const { sequelize } = require('./models');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/users');
const resourcesRouter = require('./routes/resources');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.app.trustProxy);

app.use(helmet());
app.use(hpp());

// Avoid logging query strings, which may contain sensitive values.
app.use(morgan((tokens, req, res) => JSON.stringify({
  timestamp: new Date().toISOString(),
  method: tokens.method(req, res),
  path: req.path,
  status: Number(tokens.status(req, res)),
  durationMs: Number(tokens['response-time'](req, res))
})));

const liveness = (req, res) => {
  res.status(200).json({ status: 'ok' });
};
app.get('/health', liveness);
app.get('/health/live', liveness);

app.get('/health/ready', async (req, res) => {
  if (shuttingDown) {
    return res.status(503).json({ status: 'unavailable' });
  }

  try {
    await sequelize.query('SELECT 1');
    return res.status(200).json({ status: 'ready' });
  } catch {
    return res.status(503).json({ status: 'unavailable' });
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500
});

app.use('/api', apiLimiter);

if (config.corsOrigins.length > 0) {
  app.use(cors({
    origin: (origin, callback) => {
      callback(null, !origin || config.corsOrigins.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
}

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Faculty Competence Management System!'
  });
});

app.use('/api', loginRouter);
app.use('/api', userRouter);
app.use('/api', resourcesRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  log('error', 'api_request_failed', {
    name: err.name,
    code: err.original?.code || err.parent?.code,
    method: req.method,
    path: req.path,
    status
  });

  res.status(status >= 400 && status < 600 ? status : 500).json({
    message: status < 500 ? 'Invalid request' : 'Internal server error'
  });
});

let server;
let shuttingDown = false;

function log(level, event, details = {}) {
  const output = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details
  });
  console[level === 'fatal' || level === 'error' ? 'error' : 'log'](output);
}

async function authenticateWithRetry() {
  let lastError;

  for (let attempt = 1; attempt <= config.database.connectAttempts; attempt += 1) {
    try {
      await sequelize.authenticate();
      log('info', 'database_connected');
      return;
    } catch (error) {
      lastError = error;
      if (attempt === config.database.connectAttempts || shuttingDown) break;

      const waitMs = Math.min(
        config.database.retryDelayMs * (2 ** (attempt - 1)),
        config.database.retryMaxDelayMs
      );
      log('warn', 'database_connection_retry', {
        attempt,
        waitMs,
        name: error.name,
        code: error.original?.code || error.parent?.code
      });
      await delay(waitMs);
    }
  }

  throw lastError;
}

async function startServer() {
  try {
    await authenticateWithRetry();
    if (shuttingDown) {
      await sequelize.close();
      return;
    }

    server = app.listen(config.app.port, config.app.host, () => {
      log('info', 'server_started', {
        host: config.app.host,
        port: config.app.port
      });
    });
  } catch (error) {
    if (shuttingDown) return;
    log('fatal', 'startup_failed', {
      name: error.name,
      code: error.original?.code || error.parent?.code
    });
    await sequelize.close().catch(closeError => {
      log('error', 'database_close_after_startup_failure', { name: closeError.name });
    });
    process.exit(1);
  }
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  log('info', 'shutdown_started', { signal });

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
      });
    }
    await sequelize.close();
    process.exitCode = 0;
  } catch (error) {
    log('error', 'shutdown_failed', { name: error.name });
    process.exitCode = 1;
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
