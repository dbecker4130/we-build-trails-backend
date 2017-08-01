'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
  desc: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, ref: 'user' },
  postID: { type: Schema.Types.ObjectId, ref: 'post' },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('comment', commentSchema);
