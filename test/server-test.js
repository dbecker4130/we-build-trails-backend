'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const mongoose = require('mongoose');
const server = require('../server.js');
const serverToggle = require('./lib/toggle-server.js');

const url = `http://localhost:${process.env.PORT}`;

describe('Server Test', function() {
  before(done => {
    serverToggle.serverOn(server, done);
  });
  after(done => {
    serverToggle.serverOff(server, done);
  });

  it('should return SERVER UP', done => {
    expect(server.isRunning).to.equal(true);
    done();
  });
});

describe('Database Test', function() {
  it('should return a connection', done => {
    expect(mongoose.connection.port).to.be.a('number');
    expect(mongoose.connection.name).to.equal('we-build-trails-devdb');
    done();
  });
});
