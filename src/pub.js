const path = require('path');
const Err = require('./Err');
const can = require('./auth/can');

const NOT_ARRAY = 'Body must be an array';

// [[ClassSpec.byNumber, 99], [JobPost.lookup, someone]]]

exports.root = rootPath => async (req, res) => {
  if(req.body.constructor !== Array)
    return res.status(400).json(Err.bad(NOT_ARRAY));

  const results = [];
  for(let query of req.body)
    results.push(await process(rootPath, query, req.auth));

  const codes = results.map(r => {
    if(!r[0]) return 200;
    if(!r[0].httpStatusCode) return 500;
    return r[0].httpStatusCode;
  });
  const code = Math.max(...codes);

  return res.status(code).json(results);
};

const process = async (rootPath, query, auth) => {
  try {
    const [endpointPath, ...args] = query;
    const [entityName, endpointName] = endpointPath.split('.');
    const pubPath = path.resolve(rootPath, entityName, 'pub');
    const pub = require(pubPath);
    const endpoint = pub[endpointName];
    const shouldAuthenticate = endpoint.constructor === Array;
    if(shouldAuthenticate) {
      const permission = endpoint[0].split(' ');
      let able = false;
      if(permission[0] === 'open') able = true;
      else able = await can(permission[0], permission[1], auth);
      if(!able) return [Err.auth('Permission denied')];
    }
    args.push(auth);
    const fn = shouldAuthenticate ? endpoint[1] : endpoint;
    return await fn(...args);
  }
  catch(err) { return [Err.toObject(err)]; }
};