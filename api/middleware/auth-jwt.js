const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * JWT Authentication Middleware
 *
 * Expected header:
 * Authorization: Bearer <jwt_token>
 *
 * Responsibility:
 * - Verify JWT
 * - Resolve user
 * - Attach user to req.currentUser
 */
exports.authenticateJwt = async (req, res, next) => {
  try {
    // 1. Read Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    // 2. Validate Bearer format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Access Denied: Invalid token format' });
    }

    const token = parts[1];

    // 3. Verify JWT signature & expiry
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Payload structure (from login route):
     * {
     *   sub: user.id,
     *   iat: timestamp,
     *   exp: timestamp
     * }
     */

    // 4. Fetch user (keeps behavior identical to Basic Auth)
    const user = await User.findByPk(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Access Denied: User not found' });
    }

    // 5. Attach user to request (CRITICAL CONTRACT)
    req.currentUser = user;

    // 6. Continue
    next();

  } catch (err) {
    // Token invalid, expired, or tampered
    return res.status(403).json({ message: 'Access Denied: Invalid or expired token' });
  }
};
