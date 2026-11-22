const env = process.env;

function integer(name, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const raw = env[name];
  const value = raw === undefined || raw === '' ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer from ${min} to ${max}.`);
  }
  return value;
}

function boolean(name, fallback = false) {
  const raw = env[name];
  if (raw === undefined || raw === '') return fallback;
  if (raw.toLowerCase() === 'true') return true;
  if (raw.toLowerCase() === 'false') return false;
  throw new Error(`${name} must be true or false.`);
}

function trustProxy(value) {
  if (!value) return false;
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed.split(',').map(entry => entry.trim()).filter(Boolean);
}

const requiredNames = ['JWT_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_DIALECT'];
const missing = requiredNames.filter(name => !env[name]);
const dbSsl = boolean('DB_SSL');
const pool = {
  max: integer('DB_POOL_MAX', 5, { min: 1 }),
  min: integer('DB_POOL_MIN', 0),
  acquire: integer('DB_POOL_ACQUIRE_MS', 30000, { min: 1 }),
  idle: integer('DB_POOL_IDLE_MS', 10000, { min: 0 })
};

if (pool.min > pool.max) {
  throw new Error('DB_POOL_MIN cannot exceed DB_POOL_MAX.');
}

if (dbSsl && !env.DB_SSL_CA_PATH) {
  throw new Error('DB_SSL_CA_PATH is required when DB_SSL=true.');
}

module.exports = {
  missing,
  jwtSecret: env.JWT_SECRET,
  app: {
    host: env.HOST || '0.0.0.0',
    port: integer('PORT', 5000, { min: 1, max: 65535 }),
    trustProxy: trustProxy(env.TRUST_PROXY)
  },
  corsOrigins: (env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
  database: {
    host: env.DB_HOST,
    port: integer('DB_PORT', 3306, { min: 1, max: 65535 }),
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASS,
    dialect: env.DB_DIALECT,
    logging: boolean('DB_ENABLE_LOGGING'),
    ssl: dbSsl,
    sslCaPath: env.DB_SSL_CA_PATH,
    pool,
    connectAttempts: integer('DB_CONNECT_ATTEMPTS', 5, { min: 1 }),
    retryDelayMs: integer('DB_CONNECT_RETRY_DELAY_MS', 1000, { min: 1 }),
    retryMaxDelayMs: integer('DB_CONNECT_RETRY_MAX_DELAY_MS', 8000, { min: 1 })
  }
};
