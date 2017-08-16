'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const debug = require('debug')('we-build-trails-backend:image-router');

const Router = require('express').Router;
const Image = require('../model/image.js');
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
    del([`${__dirname}/../data/*`]);
    let imageData = {
      imageURI: s3data.Location,
      objectKey: s3data.Key,
      postID: req.params.postID,
      userID: req.user._id
    };
    return new Image(imageData).save();
  })
  .then( image => {
    tempImage = image;
    tempPost.images.unshift(image._id);
    return tempPost.save();
  })
  .then( () => res.json(tempImage))
  .catch( err => {
    del([`${__dirname}/../data/*`]);
    next(createError(404, err.message));
  });
});

imageRouter.delete('/api/post/:postId/image/:imageID', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/post/:postID/image/:imageID');

  Image.findById(req.params.imageID)
  .then( image => {
    let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: image.objectKey
    };

    s3.deleteObject(params, (err) => {
      if (err) return next(err);
      Image.findByIdAndRemove(req.params.imageID)
      .then(() => res.status(204).send())
      .catch(next);
    });
  })
  .catch(err => next(createError(404, err.message)));
});
