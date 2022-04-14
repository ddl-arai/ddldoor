let express = require('express');
let doorRouter = express.Router();
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');
let Device = require('../models/device');

/* GET /door?request=(string)&devid=(number)&idm=(string)&sec=(number) */
doorRouter.get('/', async (req, res, next) => {
  /*if(req.ip !== process.env.IP){
      res.json({
          result: 99,
          message: 'Unpermitted IP',
          request: ''
      });
      return;
  }*/

  if (!req.query.devid || !req.query.idm || !req.query.sec || !req.query.request) {
    res.json({
      result: 7,
      message: 'Invalid parameter',
      request: ''
    });
    return;
  }

  /***** Temporary operation *****/
  req.query.sec = Math.floor(Date.now() / 1000);
  /*****************************/

  switch (req.query.request) {
    case 'stamp':
      /* Processing status logic */
      try {
        let card = await Card.findOne({ idm: req.query.idm }).exec();
        let device = await Device.findOne({ id: req.query.devid }).exec();

        if (!card) {
          /* No card and device */
          if (!device) {
            res.json({
              result: 4,
              message: 'Not registered idm and device',
              request: req.query.request
            });
            await Log.create({
              sec: req.query.sec,
              idm: req.query.idm,
              devid: req.query.devid,
              result: 4
            });
            return;
          }
          else {
            /* No card, exist device */
            res.json({
              result: 2,
              message: 'Not registered idm',
              request: req.query.request
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
        }

        /* Card exist and no device */
        let member = await Member.findOne({ id: card.id }).exec();
        if (!device) {
          res.json({
            result: 3,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            idm: req.query.idm,
            id: member.id,
            name: member.name,
            devid: req.query.devid,
            result: 3
          });
          return;
        }

        if (!card.enable) {
          res.json({
            result: 5,
            message: 'Disable idm',
            request: req.query.request
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

        if (!member.enable) {
          res.json({
            result: 6,
            message: 'Disable member',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            idm: req.query.idm,
            id: member.id,
            name: member.name,
            devid: req.query.devid,
            devName: device.name,
            result: 6
          });
          return;
        }

        if (card.banDevids.includes(req.query.devid)) {
          res.json({
            result: 10,
            message: 'Unpermitted member',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            idm: req.query.idm,
            id: member.id,
            name: member.name,
            devid: req.query.devid,
            devName: device.name,
            result: 10
          });
          return;
        }

        /* Status check logic */
        const prevStat = member.status;
        let result = 0;
        switch (member.status) {
          /* Initial */
          case 0:
            switch (device.func) {
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

            /* Temporary open status */
            if (device.status === 1) {
              res.json({
                result: 9,
                message: 'Success between temporary open',
                request: req.query.request
              });
            }
            else {
              res.json({
                result: 0,
                message: 'Success',
                request: req.query.request
              });
            }
            break;
          /* Attendance */
          case 1:
            switch (device.func) {
              case 'enter':
                member.status = 3;
                result = 1;
                res.json({
                  result: 1,
                  message: 'APB Error',
                  request: req.query.request
                });
                break;
              case 'exit':
                member.status = 2;

                /* Temporary open status */
                if (device.status === 1) {
                  res.json({
                    result: 9,
                    message: 'Success between temporary open',
                    request: req.query.request
                  });
                }
                else {
                  res.json({
                    result: 0,
                    message: 'Success',
                    request: req.query.request
                  });
                }
                break;
              default:
                break;
            }
            await member.save();
            break;
          /* Absence */
          case 2:
            switch (device.func) {
              case 'enter':
                member.status = 1;

                /* Temporary open status */
                if (device.status === 1) {
                  res.json({
                    result: 9,
                    message: 'Success between temporary open',
                    request: req.query.request
                  });
                }
                else {
                  res.json({
                    result: 0,
                    message: 'Success',
                    request: req.query.request
                  });
                }
                break;
              case 'exit':
                member.status = 3;
                result = 1;
                res.json({
                  result: 1,
                  message: 'APB Error',
                  request: req.query.request
                });
                break;
              default:
                break;
            }
            await member.save();
            break;
          /* APB */
          case 3:
            result = 1;
            res.json({
              result: 1,
              message: 'APB Error',
              request: req.query.request
            });
            break;
          /** 
           * 2022/02/22 [TEMP] Respond success without status check process
           *  => Add open mode by member.status = 4
           */
          case 4:
            /* Temporary open status */
            if (device.status === 1) {
              res.json({
                result: 9,
                message: 'Success between temporary open',
                request: req.query.request
              });
            }
            else {
              res.json({
                result: 0,
                message: 'Success',
                request: req.query.request
              });
            }
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
      catch (error) {
        next(error);
      }
      break;
    case 'open':
      try {
        let card = await Card.findOne({ idm: req.query.idm }).exec();
        let device = await Device.findOne({ id: req.query.devid }).exec();

        if (!card) {
          /* No card and device */
          if (!device) {
            res.json({
              result: 2,
              message: 'Not registered idm and device',
              request: req.query.request
            });
            await Log.create({
              sec: req.query.sec,
              devid: req.query.devid,
              result: 4
            });
            return;
          }
          else {
            /* No card, exist device */
            res.json({
              result: 2,
              message: 'Not registered idm',
              request: req.query.request
            });
            await Log.create({
              sec: req.query.sec,
              devid: req.query.devid,
              devName: device.name,
              result: 2
            });
            return;
          }
        }

        /* Card exist and no device */
        let member = await Member.findOne({ id: card.id }).exec();
        if (!device) {
          res.json({
            result: 2,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            result: 3
          });
          return;
        }

        if (!card.enable) {
          res.json({
            result: 2,
            message: 'Disable idm',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            devName: device.name,
            result: 5
          });
          return;
        }

        if (!member.enable) {
          res.json({
            result: 2,
            message: 'Disable member',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            devName: device.name,
            result: 6
          });
          return;
        }

        if (card.banDevids.includes(req.query.devid)) {
          res.json({
            result: 2,
            message: 'Unpermitted member',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            devName: device.name,
            result: 10
          });
          return;
        }

        let result = 7;
        switch (device.status) {
          case 0:
            device.status = 1;
            res.json({
              result: 0,
              message: 'Success',
              request: req.query.request
            });
            break;
          case 1:
            result = 9;
            res.json({
              result: 1,
              message: 'Already opened',
              request: req.query.request
            });
          default:
            break;
        }
        await device.save();
        await Log.create({
          sec: req.query.sec,
          devid: req.query.devid,
          devName: device.name,
          result: result
        });
      }
      catch (error) {
        next(error);
      }
      break;
    case 'close':
      try {
        let device = await Device.findOne({ id: req.query.devid }).exec();
        if (!device) {
          res.json({
            result: 2,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            result: 3
          });
          return;
        }

        let result = 8;
        switch (device.status) {
          case 0:
            result = 9;
            res.json({
              result: 1,
              message: 'Already closed',
              request: req.query.request
            });
            break;
          case 1:
            device.status = 0;
            res.json({
              result: 0,
              message: 'Success',
              request: req.query.request
            });
            break;
          default:
            break;
        }
        await device.save();
        await Log.create({
          sec: req.query.sec,
          devid: req.query.devid,
          devName: device.name,
          result: result
        });
      }
      catch (error) {
        next(error);
      }
      break;
    case 'status':
      try {
        let device = await Device.findOne({ id: req.query.devid }).exec();
        if (!device) {
          res.json({
            result: 2,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            result: 3
          });
          return;
        }
        switch (device.status) {
          case 0:
            if (device.open) {
              device.open = false;
            }
            await device.save();

            res.json({
              result: device.status,
              message: 'close',
              request: req.query.request
            });
            break;
          case 1:
            if (!device.open) {
              device.open = true;
              device.openStartTime = Date.now();
            }
            if (Date.now() - device.openStartTime > device.timeout) {
              device.status = 0;
              await Log.create({
                sec: req.query.sec,
                devid: req.query.devid,
                devName: device.name,
                result: 8
              });
            }
            await device.save();

            res.json({
              result: device.status,
              message: 'open',
              request: req.query.request
            });
            break;
          default:
            break;
        }
      }
      catch (error) {
        next(error);
      }

      break;
    case 'check':
      try{
        if(req.query.devid !== 5){
          res.json({
            result: 0,
            message: 'Success',
            request: req.query.request
          });
        }
        else{

        
                  let device = await Device.findOne({ id: req.query.devid }).exec();
                  /*
                  if(device.partnerId === 0){
                    res.json({
                      result: 1,
                      message: 'No set partner device',
                      request: req.query.request
                    });
                    return;
                  }*/
                  const log = await Log.findOne({devid: device.id, result: 0, sec: {$gte: req.query.sec - 5}}).exec();
                  const partner_log = await Log.findOne({devid: device.partnerId, result: 0, sec: {$gte: req.query.sec - 5}}).exec();
                  if(log || partner_log){
                    res.json({
                      result: 0,
                      message: 'Success',
                      request: req.query.request
                    });
                  }
                  else{
                    res.json({
                      result: 1,
                      message: 'Failed',
                      request: req.query.request
                    });
                  }
          }
      }
      catch(error){
        next(error);
      }
      break;
    default:
      res.json({
        result: 8,
        message: 'Not found reqeust',
        request: req.query.request
      });
      break;
  }
});

module.exports = doorRouter;