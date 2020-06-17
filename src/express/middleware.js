const rateLimit = require('express-rate-limit');
const Err = require('../Err');

/**
 * Middleware to use to limit requests
 */
exports.limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, try later...'
});

/**
 * Middleware to use for 404 response
 * @param {Request} req 
 * @param {Response} res 
 */
exports.missing = (req, res) => {
  return res.status(404)
    .json({message: `${req.path} was not found`});
};

/**
 * Global error handler
 * @param {Error} err 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
exports.err = (err, req, res, next) => {
  err = Err.toObject(err);
  return res.status(err.httpStatusCode).json(err);
};
