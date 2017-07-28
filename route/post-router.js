'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('we-build-trails-backend:post-router');

const Post = require('../model/post.js');
const Image = require('../model/image.js');
const Comment = require('../model/comment.js');
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

postRouter.get('/api/post', bearerAuth, function(req, res, next) {
  debug('GET: /api/post');

  Post.find({})
  .populate('images')
  .populate('userID')
  .populate('comments')
  .then( post => {
    console.log(post);
    if (post === null) return next(createError(404, 'no posts found'));
    res.json(post);
  })
  .catch(next);
});

postRouter.get('/api/:userID/post', bearerAuth, function(req, res, next) {
  debug('GET: /api/:userID/post');

  Post.find({userID: req.params.userID})
  .populate('images')
  .then( post => {
    res.json(post);
  })
  .catch(err => next(createError(404, err.message)));
});
