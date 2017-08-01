'use strict';

const debug = require('debug')('we-build-trails-backend:comment-router');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Router = require('express').Router;
const Comment = require('../model/comment.js');
const Post = require('../model/post.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const commentRouter = module.exports = Router();

commentRouter.post('/api/post/:postID/comment', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/post/:postID/comment');

  if (!req.body.desc) {
    res.status(400).send();
    return;
  }

  Post.findById(req.params.postID);

  req.body.postID = req.params._id;
  req.body.userID = req.user._id;
  new Comment(req.body).save()
  .then( comment => res.json(comment))
  .catch(next);
});
