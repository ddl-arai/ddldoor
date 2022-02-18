let express = require('express');
let authRouter = express.Router();
let passport = require('passport');
let generator = require('generate-password');
let crypto = require('crypto');
let User = require('../models/user');

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

/* GET auth/reset */
authRouter.get('/reset', (req, res, next) => {
    crypto.randomBytes(32, (error, buf) => {
      if(error) next(error);
      const now = new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000));
      const token = buf.toString('hex');
      const expire = now.setMinutes(now.getMinutes() + 5);  // 5 minitue for expire
      if(!('email' in req.user)){
        res.status(401);
        res.json({message: 'Unauthorized'});
        return;
      }
      User.updateOne({email: req.user['email']}, {
        pw_reset_token: token,
        pw_reset_token_expire: expire
      }, error => {
        if(error) next(error);
        res.json(token);
      });
    });
  }  
);


module.exports = authRouter;
