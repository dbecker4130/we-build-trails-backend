'use strict';

const Router = require('express').Router;
const jsoneParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('we-build-trails-backend:post-router');

const Post = require('../model/post.js');
