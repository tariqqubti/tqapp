const Model = require('./Model');

exports.done = [
  'read Task',
  async () => {
    const docs = await Model.find({status: true});
    return [200, docs];
  }
];