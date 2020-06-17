const fs = require('fs');
const path = require('path');
const express = require('../express');
const Err = require('../Err');

module.exports = rootPath => {
  if(!fs.existsSync(rootPath))
    throw new Err.fatal(`Root ${rootPath} not found`);
  const router = express.create.router();
  const dirs = fs.readdirSync(rootPath, {
    encoding: 'utf8',
    withFileTypes: true
  }).filter(dir => dir.isDirectory());
  for(let dir of dirs) {
    const entityRouterPath = path.resolve(rootPath, dir.name, 'router.js');
    if(fs.existsSync(entityRouterPath)) {
      const entityRouter = require(entityRouterPath);
      try {
        router.use(`/${dir.name}`, entityRouter);
        console.log(`/${dir.name} registered`);
      } catch(err) {
        console.error(err);
      }
    } else {
      console.warn(`Router ${entityRouterPath} not found`);
    }
  }
  return router;
};