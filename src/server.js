const http = require('http');
const mongo = require('./mongo');
const express = require('./express');
const ws = require('./ws');

/**
 * TODO:
 * Add global error handlers
 */

/**
 * Express app
 */
let app = exports.app = null;

/**
 * WebSocket server
 */
let wss = exports.wss = null;

/**
 * HTTP server
 */
let server = null;

/**
 * Connects to MongoDB,creates Express app
 * and Web Socket server.Start with this function.
 */
exports.create = () => {
  mongo.connect();
  app = exports.app = express.create.app();
  server = http.createServer(app);
  wss = exports.wss = ws.createServer(server);
};

/**
 * Starts listening to the specified port
 * Registers the not found handler
 * Registers the global error handler
 * @param {number} port - Port number for the server to bind to
 */
exports.listen = port => {
  app.use(express.middleware.missing);
  app.use(express.middleware.err);
  port = port || process.env.PORT || 8443;
  server.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
};
