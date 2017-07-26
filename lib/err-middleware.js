'use strict';

const createError = require('http-errors');
const debug = require('debug')('we-build-trails-backend:err-middleware.js');

module.exports = function(err, req, res, next) {
  debug('err-middleware');

  if(err.status) {
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'ValidationError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }
  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  console.log('server error');
  next();
};
