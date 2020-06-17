const jwt = require('jsonwebtoken');
const err = require('../Err');

const MISSING_SECRET = 'Please set or pass JWT_SECRET environment variable';

exports.verify = (token, secret) => {
  secret = secret || process.env.JWT_SECRET;
  if(!secret) return [err.fatal(MISSING_SECRET)];
  try {
    return jwt.verify(token, secret);
  } catch(err) {
    return null;
  }
};

exports.sign = ({email, permissions}, secret) => {
  secret = secret || process.env.JWT_SECRET;
  if(!secret) return [err.fatal(MISSING_SECRET)];
  const options = {
    expiresIn: 24 * 60 * 60,
  };
  const token = jwt.sign({email, permissions}, secret, options);
  return token;
};
