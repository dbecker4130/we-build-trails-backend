'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
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

  Post.find({ userID: req.params.userID })
  .populate('images')
  .then( post => {
    res.json(post);
  })
  .catch(err => next(createError(404, err.message)));
});

postRouter.put('/api/post/:postID', bearerAuth, jsonParser, function(req, res, next) {
  debug('GET: /api/post/:postID');

  if (!req.body.title) return next(createError(400, 'body required'));

  Post.findByIdAndUpdate(req.params.postID, req.body, { new: true })
  .populate('images')
  .then( post => {
    if (post === null) return next(createError(404, 'post not found'));
    res.json(post);
  })
  .catch(err => next(createError(404, err.message)));
});

postRouter.delete('/api/post/:id', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/post/:id');

  Post.findByIdAndRemove(req.params.id)
  .then( post => {
    if (post === null) return next(createError(404, 'id not found'));
    res.status(204).send();
  })
  .catch(err => next(createError(404, err.message)));
});
