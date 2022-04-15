let express = require('express');
let doorRouter = express.Router();
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');
let Device = require('../models/device');

/******  Constants *******/

/* Base */

const RESPONSE_INV_PARAMS = 7;
const RESPONSE_NOT_FOUND_REQ = 8;
const RESPONSE_UNP_IP = 99;

/* Stamp req */
const RESPONSE_OK = 0;
const RESPONSE_APB = 1;
const RESPONSE_NO_IDM = 2;
const RESPONSE_NO_DEVICE = 3;
const RESPONSE_NO_IDM_DEVICE = 4;
const RESPONSE_DISABLE_IDM = 5;
const RESPONSE_DISABLE_MEMBER = 6;
const RESPONSE_TMP_OPEN_STAMP = 9;
const RESPONSE_UNP_MEMBER = 10;

/* Tmp open req */
const RESPONSE_TMP_OPEN_INV_REQ = 1;
const RESPONSE_TMP_OPEN_ERR = 2;

/* Check req */
const RESPONSE_CHECK_ERR = 1;

/* Log code */
const LOG_OK = 0;
const LOG_APB = 1;
const LOG_NO_IDM = 2;
const LOG_NO_DEVICE = 3;
const LOG_NO_IDM_DEVICE = 4;
const LOG_DISABLE_IDM = 5;
const LOG_DISABLE_MEMBER = 6;
const LOG_TMP_OPEN = 7;
const LOG_TMP_CLOSE = 8;
const LOG_INV_REQ = 9;
const LOG_UMP_MEMBER = 10;

/***************************/


/* GET /door?request=(string)&devid=(number)&idm=(string)&sec=(number) */
doorRouter.get('/', async (req, res, next) => {
  if(req.ip !== process.env.IP){
      res.json({
          result: RESPONSE_UNP_IP,
          message: 'Unpermitted IP',
          request: ''
      });
      return;
  }

  if (!req.query.devid || !req.query.idm || !req.query.sec || !req.query.request) {
    res.json({
      result: RESPONSE_INV_PARAMS,
      message: 'Invalid parameter',
      request: ''
    });
    return;
  }

  /***** Temporary operation *****/
  req.query.sec = Math.floor(Date.now() / 1000);
  /*******************************/

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
              result: RESPONSE_NO_IDM_DEVICE,
              message: 'Not registered idm and device',
              request: req.query.request
            });
            await Log.create({
              sec: req.query.sec,
              idm: req.query.idm,
              devid: req.query.devid,
              result: LOG_NO_IDM_DEVICE
            });
            return;
          }
          else {
            /* No card, exist device */
            res.json({
              result: RESPONSE_NO_IDM,
              message: 'Not registered idm',
              request: req.query.request
            });
            await Log.create({
              sec: req.query.sec,
              idm: req.query.idm,
              devid: req.query.devid,
              devName: device.name,
              result: LOG_NO_IDM
            });
            return;
          }
        }

        /* Card exist and no device */
        let member = await Member.findOne({ id: card.id }).exec();
        if (!device) {
          res.json({
            result: RESPONSE_NO_DEVICE,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            idm: req.query.idm,
            id: member.id,
            name: member.name,
            devid: req.query.devid,
            result: LOG_NO_DEVICE
          });
          return;
        }

        if (!card.enable) {
          res.json({
            result: RESPONSE_DISABLE_IDM,
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
            result: LOG_DISABLE_IDM
          });
          return;
        }

        if (!member.enable) {
          res.json({
            result: RESPONSE_DISABLE_MEMBER,
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
            result: LOG_DISABLE_MEMBER
          });
          return;
        }

        if (card.banDevids.includes(req.query.devid)) {
          res.json({
            result: RESPONSE_UNP_MEMBER,
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
            result: LOG_UMP_MEMBER
          });
          return;
        }

        /* Status check logic */
        const prevStat = member.status;
        let result = LOG_OK;
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
                result: RESPONSE_TMP_OPEN_STAMP,
                message: 'Success between temporary open',
                request: req.query.request
              });
            }
            else {
              res.json({
                result: RESPONSE_OK,
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
                result = LOG_APB;
                res.json({
                  result: RESPONSE_APB,
                  message: 'APB Error',
                  request: req.query.request
                });
                break;
              case 'exit':
                member.status = 2;

                /* Temporary open status */
                if (device.status === 1) {
                  res.json({
                    result: RESPONSE_TMP_OPEN_STAMP,
                    message: 'Success between temporary open',
                    request: req.query.request
                  });
                }
                else {
                  res.json({
                    result: RESPONSE_OK,
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
                    result: RESPONSE_TMP_OPEN_STAMP,
                    message: 'Success between temporary open',
                    request: req.query.request
                  });
                }
                else {
                  res.json({
                    result: RESPONSE_OK,
                    message: 'Success',
                    request: req.query.request
                  });
                }
                break;
              case 'exit':
                member.status = 3;
                result = LOG_APB;
                res.json({
                  result: RESPONSE_APB,
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
            result = LOG_APB;
            res.json({
              result: RESPONSE_APB,
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
                result: RESPONSE_TMP_OPEN_STAMP,
                message: 'Success between temporary open',
                request: req.query.request
              });
            }
            else {
              res.json({
                result: RESPONSE_OK,
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
              result: RESPONSE_TMP_OPEN_ERR,
              message: 'Not registered idm and device',
              request: req.query.request
            });
            await Log.create({
              sec: req.query.sec,
              devid: req.query.devid,
              result: LOG_NO_IDM_DEVICE
            });
            return;
          }
          else {
            /* No card, exist device */
            res.json({
              result: RESPONSE_TMP_OPEN_ERR,
              message: 'Not registered idm',
              request: req.query.request
            });
            await Log.create({
              sec: req.query.sec,
              devid: req.query.devid,
              devName: device.name,
              result: LOG_NO_IDM
            });
            return;
          }
        }

        /* Card exist and no device */
        let member = await Member.findOne({ id: card.id }).exec();
        if (!device) {
          res.json({
            result: RESPONSE_TMP_OPEN_ERR,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            result: LOG_NO_DEVICE
          });
          return;
        }

        if (!card.enable) {
          res.json({
            result: RESPONSE_TMP_OPEN_ERR,
            message: 'Disable idm',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            devName: device.name,
            result: LOG_DISABLE_IDM
          });
          return;
        }

        if (!member.enable) {
          res.json({
            result: RESPONSE_TMP_OPEN_ERR,
            message: 'Disable member',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            devName: device.name,
            result: LOG_DISABLE_MEMBER
          });
          return;
        }

        if (card.banDevids.includes(req.query.devid)) {
          res.json({
            result: RESPONSE_TMP_OPEN_ERR,
            message: 'Unpermitted member',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            devName: device.name,
            result: LOG_UMP_MEMBER
          });
          return;
        }

        let result = LOG_TMP_OPEN;
        switch (device.status) {
          case 0:
            device.status = 1;
            res.json({
              result: RESPONSE_OK,
              message: 'Success',
              request: req.query.request
            });
            break;
          case 1:
            result = LOG_INV_REQ;
            res.json({
              result: RESPONSE_TMP_OPEN_INV_REQ,
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
            result: RESPONSE_TMP_OPEN_ERR,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            result: LOG_NO_DEVICE
          });
          return;
        }

        let result = LOG_TMP_CLOSE;
        switch (device.status) {
          case 0:
            result = LOG_INV_REQ;
            res.json({
              result: RESPONSE_TMP_OPEN_INV_REQ,
              message: 'Already closed',
              request: req.query.request
            });
            break;
          case 1:
            device.status = 0;
            res.json({
              result: RESPONSE_OK,
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
            result: RESPONSE_TMP_OPEN_ERR,
            message: 'Not registered device',
            request: req.query.request
          });
          await Log.create({
            sec: req.query.sec,
            devid: req.query.devid,
            result: LOG_NO_DEVICE
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
                result: LOG_TMP_CLOSE
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
        let device = await Device.findOne({ id: req.query.devid }).exec();
        if(device.partnerId === 0){
          res.json({
            result: RESPONSE_CHECK_ERR,
            message: 'No set partner device',
            request: req.query.request
          });
          return;
        }
        const log = await Log.findOne({devid: device.id, result: 0, sec: {$gte: req.query.sec - 5}}).exec();
        const partner_log = await Log.findOne({devid: device.partnerId, result: 0, sec: {$gte: req.query.sec - 5}}).exec();
        if(log || partner_log){
          res.json({
            result: RESPONSE_OK,
            message: 'Success',
            request: req.query.request
          });
        }
        else{
          res.json({
            result: RESPONSE_CHECK_ERR,
            message: 'Failed',
            request: req.query.request
          });
        }
      }
      catch(error){
        next(error);
      }
      break;
    default:
      res.json({
        result: RESPONSE_NOT_FOUND_REQ,
        message: 'Not found reqeust',
        request: req.query.request
      });
      break;
  }
});

module.exports = doorRouter;