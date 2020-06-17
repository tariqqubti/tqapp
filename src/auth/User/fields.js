const mongo = require('../../mongo');
const reg = require('../../reg');

module.exports = {
  email: {
    type: String,
    required: true,
    match: [reg.EMAIL, 'Invalid email'],
    index: true,
  },
  password: {
    type: String,
    required: true,
    minLen: [8, 'Short password'],
    match: [reg.PASSWORD, 'Weak password'],
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
  },
  permissions: [{
    level: {
      type: Number,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    tenant: {
      type: String,
      required: true,
    },
  }],
};