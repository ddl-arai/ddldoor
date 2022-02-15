let express = require('express');
let doorRouter = express.Router();
let User = require('../models/user');
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');

/* GET /door?request=(string)&devid=(number)&idm=(string)&sec=(number) */
doorRouter.get('/' , (req, res, next) => {
    if(!req.query.devid || !req.query.idm || !req.query.sec || !req.query.request){
        res.json(JSON.stringify({
            status: 2,
            message: 'Invalid parameters'
        }));
        return;
    }

    switch (req.query.request) {
        case 'stamp':
            Log.create({
                sec: req.query.sec,
                idm: req.query.idm,
                devid: req.query.devid
            }, error => {
                if(error) next(error);
                res.json(JSON.stringify({
                    status: 0,
                    message: 'Success'
                }));
                console.log('After res!');
            });
            break;
        case 'open':
            break;
        case 'something':
            break;
        default:
            res.json(JSON.stringify({
                status: 2,
                message: 'Not found the reqeust'
            }))
    } 
});

module.exports = doorRouter;