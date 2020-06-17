const mongo = require('../mongo');

const name = 'Tenant';

const fields = {
  name: {
    type: String,
    required: true,
  },
};

const schema = mongo.schema(fields);

module.exports = mongo.model(name, schema);
