'use strict';

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
