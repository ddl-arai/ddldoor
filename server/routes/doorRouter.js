let express = require('express');
let doorRouter = express.Router();
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');
let Device = require('../models/device');

/* GET /door?request=(string)&devid=(number)&idm=(string)&sec=(number) */
doorRouter.get('/' , (req, res, next) => {
    if(!req.query.devid || !req.query.idm || !req.query.sec || !req.query.request){
        res.json({
            result: 2,
            message: 'Invalid parameter'
        });
        return;
    }

    switch (req.query.request) {
        case 'stamp':
            /* First save log */
            Log.create({
                sec: req.query.sec,
                idm: req.query.idm,
                devid: req.query.devid
            }, async (error) => {
                if(error) next(error);
                
                /* Manage status */
                try {
                    let card = await Card.findOne({idm: req.query.idm}).exec();
                    if(!card){
                        res.json({
                            result: 2,
                            message: 'Not registered idm'
                        });
                        return;
                    }
                    let device = await Device.findOne({id: req.query.devid}).exec();
                    if(!device){
                        res.json({
                            result: 2,
                            message: 'Not registered device'
                        });
                        return;
                    }
                    let member = await Member.findOne({id: card.id}).exec();
                    if(member.initial){
                        member.initial = false;
                        switch(device.func){
                            case 'enter':
                                member.attendance = true;
                                break;
                            case 'exit':
                                member.attendance = false;
                                break;
                            default:
                                break;
                        }
                        await member.save();
                        res.json({
                            result: 0,
                            message: 'Success'
                        });
                    }
                    else{
                        switch(device.func){
                            case 'enter':
                                if(member.attendance){
                                    res.json({
                                        result: 1,
                                        message: 'APB Error'
                                    });
                                }
                                else{
                                    member.attendance = true;
                                    await member.save();
                                    res.json({
                                        result: 0,
                                        message: 'Success'
                                    });
                                }
                                break;
                            case 'exit':
                                if(!member.attendance){
                                    res.json({
                                        result: 1,
                                        message: 'APB Error'
                                    });
                                }
                                else{
                                    member.attendance = false;
                                    await member.save();
                                    res.json({
                                        result: 0,
                                        message: 'Success'
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                catch(error){
                    next(error);
                } 

            });
            break;
        case 'open':
            break;
        case 'something':
            break;
        default:
            res.json({
                result: 2,
                message: 'Not found reqeust'
            })
    } 
});

module.exports = doorRouter;