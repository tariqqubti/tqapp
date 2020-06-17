const mongo = require('../mongo');

exports.count = Model => async (req, res) => {
  const filter = req.body || {};
  if(mongo.hasPath(Model, 'tenant'));
    filter.tenant = req.tenant;
  return res.json(await Model.countDocuments(filter));
};

exports.list = Model => async (req, res) => {
  const output = await Model.find(...getQuery(Model, req.query));
  return res.json({output});
};

exports.get = Model => async (req, res) => {
  const query = getQuery(Model, req.query);
  query[0]._id = req.params.id;
  const output = await Model.findOne(...query);
  return res.json({output});
};

exports.find = Model => async (req, res) => {
  const {filter = {}, first, select, populate} = req.body || {};
  if(mongo.hasPath(Model, 'tenant'))
    filter.tenant = req.tenant;
  const query = first
    ? Model.findOne(filter)
    : Model.find(filter);
  select && query.select(select);
  if(populate) {
    if(populate.constructor === Array)
      populate.forEach(p => query.populate(p));
    else
      query.populate(populate);
  }
  const output = await query.exec();
  return res.json({output});
};

exports.create = Model => async (req, res) => {
  if(mongo.hasPath(Model, 'tenant'))
    req.body.tenant = req.tenant;
  const output = new Model(req.body);
  await output.save();
  return res.status(201).json({output});
};

exports.update = Model => async (req, res) => {
  const op = await Model.updateOne({_id: req.params.id}, req.body);
  const output = await Model.findById(req.params.id);
  return res.status(200).json({output, count: op.nModified});
};

exports.remove = Model => async (req, res) => {
  const op = await Model.deleteOne({_id: req.params.id});
  return res.status(200).json({count: op.deletedCount});
};

const getFilter = query =>
  query.filter && query.filter.split(',')
    .map(pair => pair.trim().split(':'))
    .reduce((acc, [key, val]) =>
      ({...acc, [key]: val}), {});

const getSelect = query =>
  query.select && query.select.replace(/,/g, ' ');

const getPopulate = query =>
  query.populate && query.populate.split(',');

const getQuery = (Model, query) => {
  const filter = getFilter(query),
    select = getSelect(query),
    options = {populate: getPopulate(query)};
  if(mongo.hasPath(Model, 'tenant'))
    filter.tenant = req.tenant;
  return [filter, select, options];
};
