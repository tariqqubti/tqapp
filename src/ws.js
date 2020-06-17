const ws = require('ws');

exports.createServer = server => {
  const wss = new ws.Server({server, clientTracking: true});
  // TODO: DB integration, rooms, track users, life beat
  wss.on('connection', client => {
  });
  return wss;
};
