/**
 * Reference:
 * https://github.com/davidbanham/express-async-errors/blob/master/index.js
 * https://github.com/MadRabbit/express-yields/blob/master/index.js
 */

const Layer = require('express/lib/router/layer');
const Router = require('express/lib/router');

const isAsync = fn => {
  const type = Object.toString.call(fn.constructor);
  return type.indexOf('AsyncFunction') !== -1;
};

const last = (arr = []) => arr[arr.length - 1];

const copyProps = (from, to) =>
  Object.keys(from).forEach(key => to[key] = from[key]);

const noop = Function.prototype;

function wrap(fn) {
  if(!isAsync(fn))
    return fn;

  const wrapper = function(...args) {
    const promise = fn.apply(this, args);
    const next = (args.length === 5 ? args[2] : last(args)) || noop;
    if(promise && promise.catch) promise.catch(err => next(err));
    return promise;
  };

  Object.defineProperty(wrapper, 'length', {
    value: fn.length,
    writable: false,
  });
  copyProps(fn, wrapper);
  return wrapper;
}

Object.defineProperty(Layer.prototype, 'handle', {
  enumerable: true,
  get() {
    return this.__handle;
  },
  set(fn) {
    fn = wrap(fn);
    this.__handle = fn;
  },
});

const originalParam = Router.prototype.constructor.param;
Router.prototype.constructor.param = function param(name, fn) {
  fn = wrap(fn);
  return originalParam.call(this, name, fn);
};
