let express = require('express');
let authRouter = express.Router();
let passport = require('passport');

/* POST auth/login. */
authRouter.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
  res.json(true);
});

/* GET auth/check */
authRouter.get('/check', (req, res, next) => {
  console.log(req);
  //if(error) next(error);
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
  //if(error) next(error);
  req.logout();
  res.json({result: 'Logout Success'});
});

module.exports = authRouter;
