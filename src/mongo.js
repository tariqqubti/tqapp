const mongoose = require('mongoose');

const Id = exports.Id = mongoose.Schema.Types.ObjectId;

exports.Ref = name => ({type: Id, ref: name});

exports.createId = () => new mongoose.Types.ObjectId;

exports.hasPath = (Model, path) =>
  !!Object.keys(Model.schema.paths).find(p => p === path);

exports.connect = async (host, name) => {
  host = host || process.env.DB_HOST || 'localhost';
  name = name || process.env.DB_NAME || 'app';
  await mongoose.connect(`mongodb://${host}/${name}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

exports.schema = (fields, options) => {
  options = Object.assign({
    timestamps: true
  }, options);
  const schema = new mongoose.Schema(fields, options);
  schema.pre('save', async function() {
    this.wasNew = this.isNew;
  });
  return schema;
};

exports.model = (name, schema) => {
  return mongoose.model(name, schema);
};
