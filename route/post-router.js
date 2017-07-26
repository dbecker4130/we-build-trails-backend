'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
// const createError = require('http-errors');
const debug = require('debug')('we-build-trails-backend:post-router');

const Post = require('../model/post.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const postRouter = module.exports = Router();

postRouter.post('/api/post', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/post');

  if (!req.body.title) {
    res.status(400).send();
    return;
  }

  req.body.userID = req.user._id;
  new Post(req.body).save()
  .then( post => res.json(post))
  .catch(next);
});
