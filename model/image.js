'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
  name: { type: String, required: true },
  imageURI: { type: String, required: true, unique: true },
  objectKey: { type: String, required: true, unique: true },
  postID: { type: Schema.Types.ObjectId, required: true },
  userID: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
  s3Data: String
});

module.exports = mongoose.model('image', imageSchema);
