let express = require('express');
let dbRouter = express.Router();
let User = require('../models/user');
let Member = require('../models/member');
let bcrypt = require('bcrypt');
const saltRounds = 10;

/* POST db/user */
dbRouter.post('/user', (req, res, next) => {
  bcrypt.hash(req.body['password'], saltRounds, (error, hash) => {
      if(error) next(error);
      req.body['password'] = hash;
      User.create(req.body, error => {
          if(error) next(error);
          res.json({result: 'success'});
      });
  });
});

/* POST db/user/exist */
dbRouter.post('/user/exist', (req, res, next) => {
  User.findOne({email: req.body['email']}, (error, user) => {
      if(error) next(error);
      if(!user){
          res.json(false);
      }
      else{
          res.json(true);
      }
  });
});

/* GET db/members */
dbRouter.get('/members', (req, res, next) => {
  Member.find({}, (error, members) => {
    if(error) next(error);
    res.json(members);
  });
});

/* POST db/member */
dbRouter.post('/member', (req, res, next) => {
  Member.create(req.body, error => {
    if(error) next(error);
    res.json(true);
  });
});

module.exports = dbRouter;
