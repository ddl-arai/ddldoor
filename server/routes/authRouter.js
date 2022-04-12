let express = require('express');
let authRouter = express.Router();
let passport = require('passport');
let generator = require('generate-password');
let bcrypt = require('bcrypt');
let User = require('../models/user');
const saltRounds = 10;

/* POST auth/login. */
authRouter.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
  res.json(true);
});

/* GET auth/check */
authRouter.get('/check', (req, res, next) => {
  if(req.isAuthenticated()){
    res.json(true);
  }
  else
  {
    res.json(false);
  }
});

/* GET auth/logout */
authRouter.get('/logout', (req, res, next) => {
  req.logout();
  res.json({result: 'Logout Success'});
});

/* GET auth/generate */
authRouter.get('/generate', (req, res, next) => {
  const password = generator.generate({
    length: 10,
    numbers: true
  });
  res.json(password);
});

/* GET auth/token/:token */
authRouter.get('/token/:token', (req, res, next) => {
  //const now = new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000));
  User.findOne({pw_reset_token: req.params.token, pw_reset_token_expire: {$gt: Date.now()}}, (error, user) => {
      if(error) next(error);
      if(!user){
          /* Invalid token or expired */
          res.json({code: 1});
      }
      else{
          res.json({code: 0, email: user.email});
      }
  });
});

/* POST auth/change/:token */
authRouter.post('/change/:token', (req, res, next) => {
  //const now = new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000));
  User.findOne({pw_reset_token: req.params.token, pw_reset_token_expire: {$gt: Date.now()}}, (error, user) => {
    if(error) next(error);
    if(!user){
      res.json(false);
      return;
    }
    else{
      bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
        if(error) next(error);
        User.updateOne({email: req.body.email}, {
            password: hash,
            pw_reset_token: null,
            pw_reset_token_expire: null
        }, error => {
            if(error) next(error);
            res.json(true);
        });
      });
    }
  });
});

module.exports = authRouter;
