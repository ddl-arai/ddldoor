let express = require('express');
let doorRouter = express.Router();
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');
let Device = require('../models/device');

/* GET /door?request=(string)&devid=(number)&idm=(string)&sec=(number) */
doorRouter.get('/' , async (req, res, next) => {
    if(!req.query.devid || !req.query.idm || !req.query.sec || !req.query.request){
        res.json({
            result: 2,
            message: 'Invalid parameter'
        });
        return;
    }

    switch(req.query.request){
        case 'stamp':
            /* Processing status logic */
            try {
                let card = await Card.findOne({idm: req.query.idm}).exec();
                let device = await Device.findOne({id: req.query.devid}).exec();
                let member = await Member.findOne({id: card.id}).exec();

                if(!card){
                    res.json({
                        result: 2,
                        message: 'Not registered idm'
                    });
                    await Log.create({
                        sec: req.query.sec,
                        idm: req.query.idm,
                        devid: req.query.devid,
                        devName: device.name,
                        result: 2
                    });
                    return;
                }
                if(!card.enable){
                    res.json({
                        result: 2,
                        message: 'Disable idm'
                    });
                    await Log.create({
                        sec: req.query.sec,
                        idm: req.query.idm,
                        id: member.id,
                        name: member.name,
                        devid: req.query.devid,
                        devName: device.name,
                        result: 3
                    });
                    return;
                }
                
                if(!device){
                    res.json({
                        result: 2,
                        message: 'Not registered device'
                    });
                    await Log.create({
                        sec: req.query.sec,
                        idm: req.query.idm,
                        id: member.id,
                        name: member.name,
                        devid: req.query.devid,
                        result: 4
                    });
                    return;
                }
        
                if(!member.enable){
                    res.json({
                        result: 2,
                        message: 'Disable member'
                    });
                    await Log.create({
                        sec: req.query.sec,
                        idm: req.query.idm,
                        id: member.id,
                        name: member.name,
                        devid: req.query.devid,
                        devName: device.name,
                        result: 5
                    });
                    return;
                }

                /* Status check logic */
                const prevStat = member.status;
                let result = 0;
                switch(member.status){
                    /* Initial */
                    case 0:
                        switch(device.func){
                            case 'enter':
                                member.status = 1;
                                break;
                            case 'exit':
                                member.status = 2;
                                break;
                            default:
                                break;
                        }
                        await member.save();
                        res.json({
                            result: 0,
                            message: 'Success'
                        });
                        break;
                    /* Attendance */
                    case 1:
                        switch(device.func){
                            case 'enter':
                                member.status = 3;
                                success = 1;
                                res.json({
                                    result: 1,
                                    message: 'APB Error'
                                });
                                break;
                            case 'exit':
                                member.status = 2;
                                res.json({
                                    result: 0,
                                    message: 'Success'
                                });
                                break;
                            default:
                                break;
                        }
                        await member.save();
                        break;
                    /* Absence */
                    case 2:
                        switch(device.func){
                            case 'enter':
                                member.status = 1;
                                res.json({
                                    result: 0,
                                    message: 'Success'
                                });
                                break;
                            case 'exit':
                                member.status = 3;
                                success = 1;
                                res.json({
                                    result: 1,
                                    message: 'APB Error'
                                });
                                break;
                            default:
                                break;
                        }
                        await member.save();
                        break;
                    /* APB */
                    case 3:
                        success = 1;
                        res.json({
                            result: 1,
                            message: 'APB Error'
                        });
                        break;
                    /** 
                     * 2022/02/22 [TEMP] Respond success without status check process
                     *  => Add open mode by member.status = 4
                     */
                    case 4:
                        res.json({
                            result: 0,
                            message: 'Success'
                        });
                        break;
                    default:
                        break;
                }
                await Log.create({
                    sec: req.query.sec,
                    idm: req.query.idm,
                    id: member.id,
                    name: member.name,
                    devid: req.query.devid,
                    devName: device.name,
                    prevStat: prevStat,
                    result: result
                });

            }
            catch(error){
                next(error);
            } 
            break;
        case 'open':
            break;
        case 'something':
            break;
        default:
            res.json({
                result: 2,
                message: 'Not found reqeust'
            });
            break;
    } 
});

module.exports = doorRouter;