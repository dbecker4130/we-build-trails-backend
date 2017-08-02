'use strict';

const debug = require('debug')('debug:clearDB');

const User = require('../../model/user.js');
const Post = require('../../model/post.js');
const Image = require('../../model/image.js');
const Comment = require('../../model/comment.js');

module.exports = function(done) {
  debug('clearing DB');
  Promise.all([
    User.remove({}),
    Post.remove({}),
    Image.remove({}),
    Comment.remove({})
  ])
  .then( () => done())
  .catch(done);
};
