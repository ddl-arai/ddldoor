let express = require('express');
let authRouter = express.Router();
let passport = require('passport');
let generator = require('generate-password');

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

module.exports = authRouter;
