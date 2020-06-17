const bcrypt = require('bcryptjs');
const express = require('../express');
const Err = require('../Err');
const reg = require('../reg');
const jwt = require('./jwt');
const can = require('./can');
const Level = require('./Level');
const User = require('./User/Model');
const Tenant = require('./Tenant');

const router = module.exports = express.create.router();

router.post('/register', async (req, res) => {
  const {email, password} = req.body;
  if(!reg.EMAIL.test(email)) throw bad(INVALID_EMAIL);
  if(!reg.PASSWORD.test(password)) throw bad(INVALID_PASSWORD);
  let user = await User.findOne({email});
  if(user) throw bad(USER_EXISTS);
  user = new User({email, password});
  await user.save();
  return res.json(jwt.sign(user));
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  if(!reg.EMAIL.test(email)) throw bad(INVALID_EMAIL);
  const user = await User.findByEmail(email);
  if(!user) throw bad(USER_MISSING);
  if(!reg.PASSWORD.test(password)) throw bad(INVALID_PASSWORD);
  const same = await bcrypt.compare(password, user.password);
  if(!same) throw bad(PASSWORD_MISMATCH);
  return res.json(jwt.sign(user));
});

router.post('/reset', async (req, res) => {
  const {email, oldPassword, newPassword} = req.body;
  const user = await User.findByEmail(email);
  if(!user)
    throw bad(USER_MISSING);
  if(!reg.PASSWORD.test(oldPassword))
    throw bad(INVALID_PASSWORD + ' old');
  if(!reg.PASSWORD.test(newPassword))
    throw bad(INVALID_PASSWORD + ' new');
  const same = await bcrypt.compare(oldPassword, user.password);
  if(!same)
    throw bad(PASSWORD_MISMATCH);
  user.password = newPassword;
  await user.save();
  return res.json({message: RESET_SUCCESS});
});

router.post('/grant', async (req, res) => {
  if(!req.auth.user)
    throw Err.auth(LOGIN_FIRST);
  const {method, entity, email} = req.body;
  if(!can('own', entity, req.auth))
    throw Err.auth(DENIED);
  const level = Level.fromMethod(method);
  const user = await User.findByEmail(email);
  const {tenant} = req.auth;
  if(can(method, entity, {user, tenant}))
    return res.json({message: ALREADY_HAS_PERMISSION});
  user.permissions.push({level, entity, tenant});
  await user.save();
  return res.json({message: GRANT_SUCCESS});
});

router.post('/recover', async (req, res) => {
});

const isProd = process.env.NODE_ENV === 'production';

const INCORRECT = 'Incorrect email or password';
const INVALID_EMAIL = 'Invalid email';
const INVALID_PASSWORD = 'Invalid password';
const USER_EXISTS = 'User already exists';
const USER_MISSING = 'User not found';
const PASSWORD_MISMATCH = 'Password mismatch';
const LOGIN_FIRST = 'You must login first';
const DENIED = 'Permission denied';
const RESET_SUCCESS = 'Successfully reset password';
const GRANT_SUCCESS = 'Successfully granted permission';
const ALREADY_HAS_PERMISSION = 'User already has permission';
const RECOVER_TOKEN_SENT = 'Recover token sent';

const bad = msg => {
  return Err.bad(isProd ? INCORRECT : msg);
};