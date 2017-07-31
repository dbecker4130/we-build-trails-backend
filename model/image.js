'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
  imageURI: { type: String, required: true, unique: true },
  objectKey: { type: String, required: true, unique: true },
  postID: { type: Schema.Types.ObjectId, ref:'post' },
  userID: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('image', imageSchema);
