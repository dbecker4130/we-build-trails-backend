'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
  title: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  created: { type: Date, default: Date.now },
  images: [{ type: Schema.Types.ObjectId, ref: 'image' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
});

module.exports = mongoose.model('post', postSchema);
