require('./patch');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

/**
 * Create an Express app, using: cors, helmet,
 * express.json, express-mongo-sanitize, xss-clean,
 * hpp and compression
 */
exports.app = () => {
  const app = express();
  app.use(
    cors(),
    helmet(),
    express.json({limit: '15kb'}),
    mongoSanitize(),
    xss(),
    hpp(),
    compression({threshold: 0}),
  );
  return app;
};

/**
 * Creates an Express router
 */
exports.router = () => express.Router();