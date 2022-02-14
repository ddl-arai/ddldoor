let express = require('express');
let stampRouter = express.Router();
let User = require('../models/user');
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');

/* GET /stamp?devno=(number)&idm=(string)&ms=(number) */
stampRouter.get('/' , (req, res, next) => {
    if(!req.query.devno || !req.query.idm || !req.query.ms){
        res.json(false);
    }    
    Log.create({
        ms: req.query.ms,
        idm: req.query.idm,
        devno: req.query.devno
    }, error => {
        if(error) next(error);
        res.json(true);
        console.log('After res!');
    });
});

module.exports = stampRouter;