'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('we-build-trails-backend:server.js');

const authRouter = require('./route/auth-router.js');
const postRouter = require('./route/post-router.js');
const imageRouter = require('./route/image-router.js');
const errors = require('./lib/err-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(express.static(`${__dirname}/build}`));
app.use(errors);
app.use(authRouter);
app.use(postRouter);
app.use(imageRouter);

const server = module.exports = app.listen(PORT, () => {
  debug(`server live: ${PORT}`);
  console.log(`server ${PORT}`);
});

server.isRunning = true;
