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

  .then( post => {
    post.commentIDs.unshift(this._id);
    return;
  })
  .catch(next);

  //NOTE Possible refactor pushing comments to post if doesn't work correctly on front end
});

commentRouter.put('/api/post/:postID/comment/:commentID', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/post/:postID/commment/:commentID');

  if (!req.body.desc) return next(createError(400, 'body required'));

  Comment.findByIdAndUpdate(req.params.commentID, req.body, { new: true })
  .then( comment => {
    if (comment === null) return next(createError(404, 'comment not found'));
    res.json(comment);
  })
  .catch(err => next(createError(404, err.message)));
});

commentRouter.delete('/api/post/:postID/comment/:commentID', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/post/:postID/comment/:commentID');

  Post.findById(req.params.postID)
  .then( post => {
    post.commentIDs.remove(req.params.commentID);
    return Comment.findByIdAndRemove(req.params.commentID);
  })
  .then( comment => {
    if (comment === null) return next(createError(404, 'id not found'));
    res.status(204).send();
  })
  .catch(err => {
    next(createError(404, err.message));
  });
});
