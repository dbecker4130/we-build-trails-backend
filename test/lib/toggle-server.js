'use strict';

const debug = require('debug')('we-build-trails-backend:server-toggle');

module.exports = exports = {};

exports.serverOn = function(server, done) {
  if (!server.isRunning) {
    server.listen(process.env.PORT, err => {
      if (err) return done(err);
      server.isRunning = true;
      debug(`SERVER UP: ${process.env.PORT}`);
      done();
    });
    return;
  }
  done();
};

exports.serverOff = function(server, done) {
  if (server.isRunning) {
    server.close(err => {
      if (err) return done(err);
      server.isRunning = false;
      debug('SERVER DOWN');
      done();
    });
    return;
  }
  done();
};
