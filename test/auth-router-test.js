'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const serverToggle = require('./lib/toggle-server.js');

mongoose.Promise = Promise;

const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const clearDB = require('./lib/clearDB.js');
const testData = require('./lib/test-data.js');
const exampleUser = testData.exampleUser;

describe('Auth Routes', function() {
  before(done => {
    serverToggle.serverOn(server, done);
  });

  after(done => {
    serverToggle.serverOff(server, done);
  });

  afterEach(done => clearDB(done));


});
