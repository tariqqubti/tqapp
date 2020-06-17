const Err = require('../Err');
const User = require('./User/Model');

const SET_ROOT_CREDENTIALS = 'Please set root credentials e.g. ROOT_EMAIL and ROOT_PASSWORD env variable';
const ROOT_EXISTS = 'Root user already exists, only password is set';
const ROOT_ADDED = 'Root user added successfully';

exports.root = async (email, password) => {
  email = email || process.env.ROOT_EMAIL;
  password = password || process.env.ROOT_PASSWORD;
  if(!email || !password)
    throw Err.fatal(SET_ROOT_CREDENTIALS);
  let root = await User.findByEmail(email);
  if(root) {
    root.password = password;
    await root.save();
    console.log(ROOT_EXISTS);
    return;
  }
  root = new User({
    email,
    password,
    permissions: [{
      level: 5, entity: '*', tenant: '*'
    }],
  });
  await root.save();
  console.log(ROOT_ADDED);
};
