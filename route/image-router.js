'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('ask-sdk');
const multer = require('multer');
const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const debug = require('debug')('we-build-trails-backend:image-router');

const Router = require('express').Router;
const Image = require('../model/imgae.js');
const Post = require('../model/post.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const imageRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if (err) return reject(err);
      resolve(s3data);
    });
  });
}

imageRouter.post('/api/post/:postID/image', bearerAuth, upload.single('image'), function(req, res, next) {
  debug('POST: /api/post/:postID/image');

  if (!req.file) {
    return next(createError(400, 'file not found'));
  }

  if (!req.file.path) {
    return next(createError(500, 'file not saved'));
  }

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };

  let tempPost;
  let tempImage;

  Post.findById(req.params.postID)
  .then( (post) => {
    tempPost = post;
    return s3uploadProm(params);
  })
  .then( s3data => {
    del([`${dataDir}/*`]);
    let imageData = {
      imageURI: s3data.Location,
      objectKey: s3data.Key,
      postID: req.params.postID,
    };
    return new Image(imageData).save();
  })
  .then( image => {
    tempImage = image;
    tempPost.images.push(image._id);
    return tempPost.save();
  })
  .then( () => res.json(tempImage))
  .catch( err => {
    del([`${dataDir}/*`]);
    next(createError(404, err.message));
  });
});
