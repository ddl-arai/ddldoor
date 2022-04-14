let express = require('express');
let dbRouter = express.Router();
let User = require('../models/user');
let Member = require('../models/member');
let Card = require('../models/card');
let Log = require('../models/log');
let Device = require('../models/device');
let Holiday = require('../models/holiday');
let bcrypt = require('bcrypt');
let crypto = require('crypto');
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
    //const now = new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000));
    const token = buf.toString('hex');
    const expire = Date.now() + 3 * 60 * 1000;  // 3 minitue for expire
    User.updateOne({email: req.user['email']}, {
      pw_reset_token: token,
      pw_reset_token_expire: expire
    }, error => {
      if(error) next(error);
      res.json(token);
    });
  });
});

/* GET db/qr */
dbRouter.get('/qr', (req, res, next) => {
  crypto.randomBytes(32, (error, buf) => {
    if(error) next(error);
    const token = buf.toString('hex');
    const expire = Date.now() + 3 * 60 * 1000;  // 3 minitue for expire
    User.updateOne({email: req.user['email']}, {$set: {
      qr_token: token,
      qr_token_expire: expire
    }}, error => {
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

/* PUT db/user/set */
dbRouter.put('/user/set', async (req, res, next) => {
  try {
    let user = await User.findOne({associated_member_id: req.body['id']}).exec();
    if(user){
      res.json({result: 1});
    }
    else{
      await User.updateOne({email: req.user['email']}, {$set: {associated_member_id: req.body['id']}}).exec();
      res.json({result: 0});
    }
  }
  catch(error){
    next(error);
  }
});

/* GET db/user/release */
dbRouter.get('/user/release', (req, res, next) => {
  User.updateOne({email: req.user['email']}, {$set: {associated_member_id: 0}}, error => {
    if(error) next(error);
    res.json(true);
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
dbRouter.delete('/member/:id', async (req, res, next) => {
  try {
    await Card.deleteMany({id: req.params.id}).exec();
    let user = await User.findOne({associated_member_id: req.params.id}).exec();
    if(user){
      user.associated_member_id = 0;
      await user.save();
    }
    await Member.deleteOne({id: req.params.id}).exec();
    res.json(true);
  }
  catch(error){
    next(error);
  }
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

/* GET db/logs/:size */
dbRouter.get('/logs/:size', async (req, res, next) => {
  try {
    let logs = await Log.find({}).sort({no: -1}).limit(Number(req.params.size)).exec();
    res.json(logs);
  } 
  catch(error){
    next(error);
  }
})

/* POST db/logs/delete */
dbRouter.post('/logs/delete', async (req, res, next) => {
  try {
    let logs = await Log.find({}).exec();
    logs = logs.filter(log => (log.sec * 1000) >= req.body['start'] && (log.sec * 1000) <= req.body['end']);
    let counter = 0;
    for(let log of logs){
      await Log.deleteOne({no: log.no}).exec();
      counter++;
    }
    res.json(counter);
  }
  catch(error){
    next(error);
  }
});

/* POST db/log */
dbRouter.post('/log', (req, res, next) => {
  Log.create(req.body, error => {
    if(error) next(error);
    res.json(true);
  })
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
  });
});

/* PUT db/device */
dbRouter.put('/device', async (req, res, next) => {
  try {
    let device = await Device.findOne({id: req.body.id}).exec();
    let partner_device = await Device.findOne({id: device.partnerId}).exec();
    if(partner_device){
      partner_device.partnerId = 0;
      await partner_device.save();
    }
    await Device.updateOne({id: req.body.id}, req.body).exec();
    if(req.body.partnerId){
      await Device.updateOne({id: req.body.partnerId}, {$set: {partnerId: req.body.id}}).exec();
    }
    res.json(true);
  }
  catch(error){
    next(error);
  }
});

/* PUT db/device/tmp */
dbRouter.put('/device/tmp', async (req, res, next) => {
  try {
    let device = await Device.findOne({id: req.body.id}).exec();
    const now = Math.floor(Date.now() / 1000);
    /* Already closed or open */
    if((req.body.status === 0 && device.status === 0) || (req.body.status === 1 && device.status === 1)){
      await Log.create({
        sec: now,
        devid: req.body.id,
        devName: req.body.name,
        result: 9
      });
      res.json(false);
      return;
    }
    device.status = req.body.status;
    await device.save();
    res.json(true);
  }
  catch(error){
    next(error);
  }
});

/* POST db/device */
dbRouter.post('/device', async (req, res, next) => {
  try {
    await Device.create(req.body);
    if(req.body.partnerId){
      await Device.updateOne({id: req.body.partnerId}, {$set: {partnerId: req.body.id}}).exec();
    }
    res.json(true);
  }
  catch(error){
    next(error);
  }
});

/* DELETE db/device/:id */
dbRouter.delete('/device/:id', async (req, res, next) => {
  try {
    let device = await Device.findOne({id: req.params.id}).exec();
    let partner_device = await Device.findOne({id: device.partnerId}).exec();
    if(partner_device){
      partner_device.partnerId = 0;
      await partner_device.save();
    }
    await Device.deleteOne({id: req.params.id}).exec();
    res.json(true);
  }
  catch(error){
    next(error);
  }
});

/* GET db/mode/zaru */
dbRouter.get('/mode/zaru', (req, res, next) => {
  Member.updateMany({}, {$set: {status: 4}}, error => {
    if(error) next(error);
    res.json(true);
  });
});

/* POST db/holiday */
dbRouter.post('/holiday', async (req, res, next) => {
  try {
    await Holiday.create(req.body);
    res.json(true);
  }
  catch(error){
    next(error);
  }
});

/* DELETE db/holiday/:date */
dbRouter.delete('/holiday/:date', (req, res, next) => {
  Holiday.deleteOne({date: req.params.date}, error => {
    if(error) next(error);
    res.json(true);
  });
});

/* GET db/holidays */
dbRouter.get('/holidays', (req, res, next) => {
  Holiday.find({}, (error, holidays) => {
    if(error) next(error);
    res.json(holidays);
  });
});

/* GET db/workHours */
dbRouter.post('/workHours', async (req, res, next) => {
  try {
    /* In case of null on both, set 30 days */
    let dateObj = {};
    if(req.body['start'] === 'null' && req.body['end'] === 'null'){
      let now = new Date();
      dateObj.endPoint = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
      now = new Date(dateObj.endPoint.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateObj.startPoint = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
    }
    else{
      dateObj.startPoint = new Date(req.body['start']);
      dateObj.endPoint = new Date(req.body['end']);
    }
    let dateList = [];
    dateObj.numberOfDate = (dateObj.endPoint.getTime() - dateObj.startPoint.getTime()) / (24 * 60 * 60 * 1000) + 1;
    for(let i = 0; i < dateObj.numberOfDate; i++){
      dateList.push(new Date(dateObj.startPoint.getTime() + i * 24 * 60 * 60 * 1000));
    }

    /* Depend on device db. Critical problem that device is deleted from db! */
    let enterDevids = (await Device.find({func: 'enter'}).exec()).map(device => device.id);
    let exitDevids = (await Device.find({func: 'exit'}).exec()).map(device => device.id);

    let response = [];
    let ids = [];
    if(req.body['ids'].length !== 0){
      ids = req.body['ids'];
    }
    else{
      ids = (await Member.find({}).exec()).map(member => member.id);
    }
    for(let id of ids){
      let logs = await Log.find({id: id}).exec();
      logs = logs.filter(log => (log.sec * 1000) >= dateObj.startPoint.getTime() && (log.sec * 1000) <= (dateObj.endPoint.getTime() + 24 * 60 * 60 * 1000)); // For performance
      let filteredEnterLogs = logs.filter(log => enterDevids.includes(log.devid));
      let filteredExitLogs = logs.filter(log => exitDevids.includes(log.devid));

      for(let date of dateList){
        const inf = new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 6:00`);
        const sup = new Date(new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 5:59`).getTime() + 24 * 60 * 60 * 1000);
        let extractedEnterLogs = filteredEnterLogs.filter(log => (inf.getTime() <= log.sec * 1000) && (sup.getTime() >= log.sec * 1000));
        let extractedExitLogs = filteredExitLogs.filter(log => (inf.getTime() <= log.sec * 1000 && sup.getTime() >= log.sec * 1000));

        let resultObj = {
          start: '',
          end: '',
          hours: ''
        }
        if(extractedEnterLogs.length !== 0 && extractedExitLogs.length !== 0){
          let enterStamp = extractedEnterLogs[(extractedEnterLogs.map(log => log.sec)).indexOf(Math.min.apply(null, extractedEnterLogs.map(log => log.sec)))];
          let exitStamp = extractedExitLogs[(extractedExitLogs.map(log => log.sec)).indexOf(Math.max.apply(null, extractedExitLogs.map(log => log.sec)))];
          enterStamp = roundCeil(new Date(enterStamp.sec * 1000), req.body['round']);
          exitStamp = roundFloor(new Date(exitStamp.sec * 1000), req.body['round']);

          let startAdjObj = {
            oriHours: enterStamp.getHours(),
            adjDate: 1,
            adjHours: 0
          }
          let endAdjObj = {
            oriHours: exitStamp.getHours(),
            adjDate: 1,
            adjHours: 0
          }
          if(enterStamp.getHours() < 6){
            startAdjObj.oriHours += 24;
            startAdjObj.adjDate = 2;
            startAdjObj.adjHours = 24;
          }
          if(exitStamp.getHours() < 6){
            endAdjObj.oriHours += 24
            endAdjObj.adjDate = 2;
            endAdjObj.adjHours = 24;
          }
          resultObj.start = `${pad(startAdjObj.oriHours)}:${pad(enterStamp.getMinutes())}`;
          resultObj.end = `${pad(endAdjObj.oriHours)}:${pad(exitStamp.getMinutes())}`;

          let calcBuf = {};
          calcBuf.diff = new Date(`1970/1/${endAdjObj.adjDate} ${pad(endAdjObj.oriHours - endAdjObj.adjHours)}:${pad(exitStamp.getMinutes())}`).getTime() 
            - new Date(`1970/1/${startAdjObj.adjDate} ${pad(startAdjObj.oriHours - startAdjObj.adjHours)}:${pad(enterStamp.getMinutes())}`).getTime();
          calcBuf.hour = Math.floor(calcBuf.diff / (60 * 60 * 1000));
          calcBuf.min = (calcBuf.diff - calcBuf.hour * 60 * 60 * 1000) / (60 * 1000);
          if(calcBuf.hour < 0 || calcBuf.min < 0){
            calcBuf.hour = 0;
            calcBuf.min = 0;
          }
          resultObj.hours = `${pad(calcBuf.hour)}:${pad(calcBuf.min)}`;

        }
        else if(extractedEnterLogs.length !== 0){
          /* enter exist */
          let enterStamp = extractedEnterLogs[(extractedEnterLogs.map(log => log.sec)).indexOf(Math.min.apply(null, extractedEnterLogs.map(log => log.sec)))];
          enterStamp = roundCeil(new Date(enterStamp.sec * 1000), req.body['round']);
          if(enterStamp.getHours() < 6){
            resultObj.start = `${enterStamp.getHours() + 24}:${pad(enterStamp.getMinutes())}`;
          }
          else{
            resultObj.start = `${pad(enterStamp.getHours())}:${pad(enterStamp.getMinutes())}`;
          }
        }
        else if(extractedExitLogs.length !== 0){
           /* exit exist */
           let exitStamp = extractedExitLogs[(extractedExitLogs.map(log => log.sec)).indexOf(Math.max.apply(null, extractedExitLogs.map(log => log.sec)))];
           exitStamp = roundFloor(new Date(exitStamp.sec * 1000), req.body['round']);
           if(exitStamp.getHours() < 6){
            resultObj.end = `${exitStamp.getHours() + 24}:${pad(exitStamp.getMinutes())}`;
           }
           else{
            resultObj.end = `${pad(exitStamp.getHours())}:${pad(exitStamp.getMinutes())}`;
           }
        }
        else{
          // 
        }

        if(resultObj.start !== '' || resultObj.end !== '' || resultObj.hours !== ''){
          let member = await Member.findOne({id: id}).exec();
          response.push({
            id: id,
            name: member.name,
            date: date.toString(),
            start: resultObj.start,
            end: resultObj.end,
            hours: resultObj.hours
          });
        }
      }
    }
    res.json(response);
  }
  catch(error){
    next(error);
  }
})

function roundCeil(date, round){
  if(round !== 0){
    date = new Date(date.setMinutes(Math.ceil(date.getMinutes() / round) * round));
  }
  return date;
}

function roundFloor(date, round){
  if(round !== 0){
    date = new Date(date.setMinutes(Math.floor(date.getMinutes() / round) * round));
  }
  return date;
}

function pad(number){
  let str = `${('0' + String(number)).slice(-2)}`;
  return str;
}

module.exports = dbRouter;
