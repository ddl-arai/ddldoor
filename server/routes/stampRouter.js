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
    const now = new Date(req.query.time);
    Log.create({
        date: `${now.getFullYear()}/${zeroPad(now.getMonth() + 1)}/${zeroPad(now.getDay())}`,
        time: `${zeroPad(now.getHours())}:${zeroPad(now.getMinutes())}:${zeroPad(now.getSeconds())}`,
        idm: req.query.idm,
        devno: req.query.devno
    }, error => {
        if(error) next(error);
        res.json(true);
        console.log('After res!');
    });
});

/* 1 -> 01 */
function zeroPad(str){
    return ('0' + str).slice(-2);
}

module.exports = stampRouter;