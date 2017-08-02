
[![Build Status](https://travis-ci.org/dbecker4130/we-build-trails-backend.svg?branch=master)](https://travis-ci.org/dbecker4130/we-build-trails-backend)

[![Coverage Status](https://coveralls.io/repos/github/dbecker4130/we-build-trails-backend/badge.svg?branch=master)](https://coveralls.io/github/dbecker4130/we-build-trails-backend?branch=master)

# we-build-trails-backend

2.0.0

A web blog where BMX and mountain bikers can post the process of building, maintaining, and riding a set of trails

### User Model

This application contains a multiple resource RESTful API that uses MongoDB to serve as a database, and Express.js to handle routing. It uses basic and bearer authentication to give access to new and returning users. The user is able to run CRUD operations, allowing them to create and update a post, and add or delete an image from their post. Users are also able to leave comments on each others posts. All images are housed using Amazon Web Services S3 storage. The models are being used through mongoose that connect with a MongoDB collection. The front-end was built on the AngularJS framework using a component based architecture with Webpack to handle the module build process. Sass was implemented for all styling.

# Set Up

In your Terminal

```sh
$ git clone https://github.com/dbecker4130/we-build-trails-backend.git
$ cd we-build-trails-backend
$ npm i
```
This will install the proper dependencies from the package.json file.

### Use

You will need to have 3 terminal shells open to use this application.

* In one shell, run `mongod` to start the database.
* In another shell, run `npm run start`. You will receive a response of 'server live on PORT: `<PORT>`'
* The last shell will be used to make GET, PUT, POST, and DELETE requests

# Sign Up

  ```
  http POST localhost:8000/api/signup username='user1' email='user1@email.com' password='1234' profileImageURI='image' location='some place'
  ```

* On success you will receive a <token> and <userID>.
* Example:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjYyNGQxOGIzYWNiYmUwMGEwNjg2ZmQzODExOWJkMGI1ZGNiYmM3Mzg4ZmNlMGZjOWRmMDRkZjFhMmUzNzExNzYiLCJpYXQiOjE0ODQyNDc3MTR9.mTuf2mgKfh8pJ4DeAd1ZiFPqdhgH1KFKQf32J1LybOg'

# Sign In

  `http GET localhost:8000/api/signin --auth <username>:<password>`

### Post Model

# Create Post
  POST
  ```sh
  http POST :3000/api/post Authorization:'Bearer <token>' title='post' userID='<userID>'
  ```
  On success, you will receive a <postID>.
# Retrieve All Posts
  GET
  ```sh
  http GET :3000/api/post Authorization:'Bearer <token>'
  ```

# Retrieve Users Posts
  GET
  ```sh
  http GET :3000/api/<userID>/post Authorization:'Bearer <token>'
  ```

# Update Post
  PUT
  ```sh
  http PUT :3000/api/post/<postID> Authorization:'Bearer <token>' title='new post'
  ```

# Delete Post
  DELETE
  ```sh
  http DELETE :3000/api/post/<postID> Authorization:'Bearer <token>'
  ```

### Image Model

# Upload Image
  POST
  ```sh
  http --form POST :3000/api/post/<postID>/image Authorization:'Bearer <token>' image@./test/data/tester.png
  ```

  On success, you will receive a <imageID>
# Delete Image
  DELETE
  ```sh
  http --form DELETE :3000/api/post/<postID>/image/<imageID> Authorization:'Bearer <token>'
  ```
