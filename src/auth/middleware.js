const Err = require('../Err');
const jwt = require('./jwt');
const can = require('./can');

/**
 * Verify authorization token in header if present
 * and add tenant, creating req.auth.
 */
exports.parse = (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  req.auth = {
    user: token && jwt.verify(token),
    tenant: req.get('x-tenant'),
  };
  next();
};

/**
 * Check if req.auth.user is truthy
 */
exports.loggedIn = (req, res, next) => {
  if(req.auth.user)
    return next();
  throw Err.auth('You must login first');
};

/**
 * Middleware to throw if user can do a certain
 * method on a certain entity at a certain tenant
 * @param {string} permission e.g. 'read tasks'
 */
exports.can = permission => (req, res, next) => {
  const [method, entity] = permission.split(' ');
  const able = can(method, entity, req.auth);
  if(!able) throw Err.auth('Permission denied');
  next();
};
