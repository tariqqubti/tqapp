const Err = require('../Err');

/**
 * Convert from method e.g. read to level e.g. 1
 * @param {string} method convert method to level,
 * count, get, list, find, read = 1,
 * update = 2, create = 3, remove = 4, own = 5
 */
exports.fromMethod = method => {
  const reads = ['count', 'get', 'list', 'find'];
  const levels = {read: 1, update: 2, create: 3, remove: 4, own: 5};
  const normalized = reads.some(m => m === method) ? 'read' : method;
  const level = levels[normalized];
  if(!level) throw Err.bad('Bad method');
  return levels[normalized];
};