const express = require('../express');
const mongo = require('../mongo');
const auth = require('../auth');
const methods = require('./methods');

exports.create = (Model, endpoints) =>
  use(express.create.router(), Model, endpoints);

const use = exports.use = (router, Model, endpoints = DEFAULT_ENDPOINTS) => {
  const name = Model.modelName;
  const hasTenant = mongo.hasPath(Model, 'tenant');
  endpoints = endpoints.replace('read', 'count get list find');
  endpoints.split(' ').forEach(endpoint => {
    const [method, path] = ENDPOINTS[endpoint];
    const handler = methods[endpoint](Model);
    const handlers = [handler];
    if(hasTenant)
      handlers.unshift(auth.middleware.can(`${method} ${name}`))
    router[method](path, handlers);
  });
  return router;
};

const ENDPOINTS = {
  count: ['get', '/count'],
  get: ['get', '/:id'],
  list: ['get', '/'],
  find: ['post', '/find'],
  create: ['post', '/'],
  update: ['put', '/:id'],
  remove: ['delete', '/:id'],
};

const DEFAULT_ENDPOINTS = 'read create update remove';