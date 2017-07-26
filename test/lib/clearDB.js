'use strict';

const debug = require('debug')('debug:clearDB');

const User = require('../../model/user.js');

module.exports = function(done) {
  debug('clearing DB');
  Promise.all([
    User.remove({})
  ])
  .then( () => done())
  .catch(done);
};
