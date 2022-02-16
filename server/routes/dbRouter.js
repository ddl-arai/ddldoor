let express = require('express');
let dbRouter = express.Router();
let User = require('../models/user');
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');
let Device = require('../models/device');
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

/* GET db/members/:id */
dbRouter.get('/member/:id', (req, res, next) => {
  Member.findOne({id: req.params.id}, (error, member) => {
      if(error) next(error);
      res.json(member);
  })
})

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

module.exports = dbRouter;
