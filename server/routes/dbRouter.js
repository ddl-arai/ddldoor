let express = require('express');
let dbRouter = express.Router();
let User = require('../models/user');
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');
let Device = require('../models/device');
let bcrypt = require('bcrypt');
let crypto = require('crypto');
const member = require('../models/member');
const saltRounds = 10;

/* POST db/user */
dbRouter.post('/user', (req, res, next) => {
  bcrypt.hash(req.body['password'], saltRounds, (error, hash) => {
      if(error) next(error);
      req.body['password'] = hash;
      User.create(req.body, error => {
          if(error) next(error);
          res.json(true);
      });
  });
});

/* POST db/user/exist/:email */
dbRouter.get('/user/exist/:email', (req, res, next) => {
  User.findOne({email: req.params.email}, (error, user) => {
      if(error) next(error);
      if(!user){
          res.json(false);
      }
      else{
          res.json(true);
      }
  });
});

/* GET db/reset */
dbRouter.get('/reset', (req, res, next) => {
  crypto.randomBytes(32, (error, buf) => {
    if(error) next(error);
    const now = new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000));
    const token = buf.toString('hex');
    const expire = now.setMinutes(now.getMinutes() + 5);  // 5 minitue for expire
    User.updateOne({email: req.user['email']}, {
      pw_reset_token: token,
      pw_reset_token_expire: expire
    }, error => {
      if(error) next(error);
      res.json(token);
    });
  });
});

/* GET db/user */
dbRouter.get('/user', (req, res, next) => {
  User.findOne({email: req.user['email']}, (error, user) => {
    if(error) next(error);
    user.password = '';
    res.json(user);
  });
});

/* GET db/users */
dbRouter.get('/users', (req, res, next) => {
  User.find({}, (error, users) => {
    if(error) next(error);
    users.forEach(user => {
      user.password = '';
    });
    res.json(users);
  });
});

/* DELETE db/user/:email */
dbRouter.delete('/user/:email', (req, res, next) => {
  if(req.params.email === req.user['email']){
    res.json(false);
    return;
  }
  User.deleteOne({email: req.params.email}, error => {
    if(error) next(error);
      res.json(true);
  });
});

/* GET db/members/:id */
dbRouter.get('/member/:id', (req, res, next) => {
  Member.findOne({id: req.params.id}, (error, member) => {
      if(error) next(error);
      res.json(member);
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
  Member.find({}, (error, members) => {
    if(error) next(error);
    let dupMember = members.find(el => el.id === req.body.id);
    if(dupMember){
      res.json(false);
    }
    else{
      Member.create(req.body, error => {
        if(error) next(error);
        res.json(true);
      });
    }
  });
});

/* PUT db/member */
dbRouter.put('/member', (req, res, next) => {
  Member.updateOne({id: req.body.id}, req.body, error => {
      if(error) next(error);
      res.json(true);
  });
});

/* DELETE db/member/:id */
dbRouter.delete('/member/:id', (req, res, next) => {
  Card.deleteMany({id: req.params.id}, error => {
    if(error) next(error);
    Member.deleteOne({id: req.params.id}, error => {
      if(error) next(error);
      res.json(true);
    });
  })
});

/* GET db/card/:idm */
dbRouter.get('/card/:idm', (req, res, next) => {
  Card.findOne({idm: req.params.idm}, (error, card) => {
      if(error) next(error);
      res.json(card);
  })
});

/* GET db/card/exist/:idm */
dbRouter.get('/card/exist/:idm', (req, res, next) => {
  Card.findOne({idm:req.params.idm}, (error, card) => {
    if(error) next(error);
      if(!card){
          res.json(false);
      }
      else{
          res.json(true);
      }
  });
});

/* GET db/cards */
dbRouter.get('/cards', (req, res, next) => {
  Card.find({}, (error, cards) => {
    if(error) next(error);
    res.json(cards);
  });
});

/* POST db/card */
dbRouter.post('/card', (req, res, next) => {
  let now = new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000));
  /* Expired by 5 years */
  req.body.expire = new Date(now.setFullYear(now.getFullYear() + 5));
  Card.create(req.body, error => {
    if(error) next(error);
    res.json(true);
  });
});

/* PUT db/card */
dbRouter.put('/card', (req, res, next) => {
  Card.updateOne({idm: req.body.idm}, req.body, error => {
      if(error) next(error);
      res.json(true);
  });
});

/* DELETE db/card/:id */
dbRouter.delete('/card/:idm', (req, res, next) => {
  Card.deleteOne({idm: req.params.idm}, error => {
    if(error) next(error);
    res.json(true);
  });
});

/* GET db/logs */
dbRouter.get('/logs', (req, res, next) => {
  Log.find({}, (error, logs) => {
    if(error) next(error);
    res.json(logs);
  });
});

/* GET db/devices */
dbRouter.get('/devices', (req, res, next) => {
  Device.find({}, (error, devices) => {
    if(error) next(error);
    res.json(devices);
  });
});

/* GET db/device/:idm */
dbRouter.get('/device/:id', (req, res, next) => {
  Device.findOne({id: req.params.id}, (error, device) => {
      if(error) next(error);
      res.json(device);
  })
});

/* PUT db/device */
dbRouter.put('/device', (req, res, next) => {
  Device.updateOne({id: req.body.id}, req.body, error => {
      if(error) next(error);
      res.json(true);
  });
});

/* POST db/device */
dbRouter.post('/device', (req, res, next) => {
  Device.create(req.body, error => {
    if(error) next(error);
    res.json(true);
  });
});

/* DELETE db/device/:id */
dbRouter.delete('/device/:id', (req, res, next) => {
  Device.deleteOne({id: req.params.id}, error => {
    if(error) next(error);
    res.json(true);
  });
});

/* GET db/mode/zaru */
dbRouter.get('/mode/zaru', (req, res, next) => {
  Member.updateMany({}, {$set: {status: 4}}, error => {
    if(error) next(error);
    res.json(true);
  });
});

module.exports = dbRouter;
