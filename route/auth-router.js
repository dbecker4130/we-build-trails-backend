'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('we-build-trails-backend:auth-router');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/basic-auth-middleware.js');

const createError = require('http-errors');
const User = require('../model/user.js');

const authRouter = module.exports = Router();
