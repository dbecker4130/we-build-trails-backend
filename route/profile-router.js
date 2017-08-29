'use strict';

const jsonParser = require('body-parser').json();
const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('we-build-trails-backend:profile-router');

const Image = require('../model/image.js');
const User = require('../model/user.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const profileRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if (err) return reject (err);
      resolve(s3data);
    });
  });
}

profileRouter.post('/api/profile/:userID/image', bearerAuth, upload.single('image'), function(req, res, next) {
  debug('POST: /api/profile/:userID/image');

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

  let tempUser;
  let tempImage;
  User.findById(req.params.userID)
  .then( user => {
    tempUser = user;
    return s3uploadProm(params);
  })
  .then( s3data => {
    del([`${dataDir}/*`]);
    let imageData = {
      imageURI: s3data.Location,
      objectKey: s3data.Key,
      userID: req.user._id
    };
    return new Image(imageData).save();
  })
  .then( image => {
    tempImage = image;
    tempUser.profileImageURI = image.imageURI;
    return tempUser.save();
  })
  .then( () => res.json(tempImage))
  .catch( err => {
    del([`${dataDir}/*`]);
    next(createError(404, err.message));
  });
});
