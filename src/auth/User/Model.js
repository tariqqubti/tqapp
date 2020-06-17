const bcrypt = require('bcryptjs');
const mongo = require('../../mongo');
const reg = require('../../reg');
const Err = require('../../Err');

const name = 'User';
const fields = require('./fields');

const schema = mongo.schema(fields);

schema.pre('save', async function() {
  if(!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

schema.statics.findByEmail = async function(email) {
  if(!reg.EMAIL.test(email))
    throw Err.bad('Invalid email');
  return await this.findOne({email});
}

module.exports = mongo.model(name, schema);
