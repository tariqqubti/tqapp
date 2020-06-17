module.exports = class Err extends Error {
  constructor(msg, httpStatusCode, name) {
    super(msg);
    if(Error.captureStackTrace)
      Error.captureStackTrace(this, Err);
    this.name = name;
    this.httpStatusCode = httpStatusCode;
  }
  toJSON() {
    return Err.toObject(this);
  }
  static toObject(err) {
    const obj = {
      name: err.name,
      httpStatusCode: err.httpStatusCode ||
        (err.name === 'ValidationError' && 400) ||
        500,
    };
    if(process.env.NODE_ENV === 'development') {
      obj.code = err.code;
      obj.message = err.message;
      obj.stack = err.stack.split(/\n/);
    }
    return obj;
  }
  static bad(msg) {
    return new Err(msg, 400, 'Bad Request');
  }
  static auth(msg) {
    return new Err(msg, 401, 'Unauthorized');
  }
  static forbidden(msg) {
    return new Err(msg, 403, 'Forbidden');
  }
  static missing(msg) {
    return new Err(msg, 404, 'Not Found');
  }
  static fatal(msg) {
    return new Err(msg, 500, 'Server Error');
  }
};


