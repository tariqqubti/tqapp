const {mongo} = require('../../../index');

module.exports = mongo.model('Task', mongo.schema({
  title: String,
  status: Boolean,
}));
