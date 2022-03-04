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

/* GET db/workHours */
dbRouter.post('/workHours', async (req, res, next) => {
  try {
    let startpoint;
    let endpoint;
    /* In case of null on both, set 30 days */
    if(req.body['start'] === 'null' && req.body['end'] === 'null'){
      console.log('1');
      let time = new Date();
      endpoint = new Date(`${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`);
      time = new Date(endpoint.getTime() - 4 * 24 * 60 * 60 * 1000);
      startpoint = new Date(`${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`)
    }
    else{
      startpoint = new Date(req.body['start']);
      endpoint = new Date(req.body['end']);
    }
    let dateList = [];
    let number_of_date = (endpoint.getTime() - startpoint.getTime()) / (24 * 60 * 60 * 1000) + 1;
    console.log(`number of date: ${number_of_date}`);
    for(let i = 0; i < number_of_date; i++){
      dateList.push(new Date(startpoint.getTime() + i * 24 * 60 * 60 * 1000));
    }
    console.log(`dateList: ${dateList}`);

    /* Depend on device db. Critical problem that device is deleted from db! */
    let enter_devids = (await Device.find({func: 'enter'}).exec()).map(device => device.id);
    let exit_devids = (await Device.find({func: 'exit'}).exec()).map(device => device.id);

    let retured_data = [];
    let ids = [];
    if(req.body['ids'].length !== 0){
      ids = req.body['ids'];
    }
    else{
      ids = (await Member.find({}).exec()).map(member => member.id);
    }
    for(let id of ids){
      let logs = await Log.find({id: id}).exec();
      /* First, reduce given range for performance */
      logs = logs.filter(log => (log.sec * 1000) >= startpoint.getTime() && (log.sec * 1000) <= (endpoint.getTime() + 24 * 60 * 60 * 1000));
      //console.log(logs);

      //console.log(enter_devids);
      //console.log(exit_devids);
      let enter_logs = logs.filter(log => enter_devids.includes(log.devid));
      let exit_logs = logs.filter(log => exit_devids.includes(log.devid));

      for(let date of dateList){
        let inf = new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 6:00`);
        let sup = new Date(new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 5:59`).getTime() + 24 * 60 * 60 * 1000);
        console.log(`inf: ${inf}`);
        console.log(`sup: ${sup}`);
        
        let extract_enter_logs = enter_logs.filter(log => (inf.getTime() <= log.sec * 1000) && (sup.getTime() >= log.sec * 1000));
        let extract_exit_logs = exit_logs.filter(log => (inf.getTime() <= log.sec * 1000 && sup.getTime() >= log.sec * 1000));
        console.log(`extract enter logs: ${extract_enter_logs}`);
        console.log(`extract exit logs: ${extract_exit_logs}`);
        
        let start = '';
        let end = '';
        let hours = '';
        if(extract_enter_logs.length !== 0 && extract_exit_logs.length !== 0){
          console.log(1);
          //console.log(Math.min(enter_logs.map(log => log.sec)));
          //console.log(enter_logs.map(log => log.sec));
          //let enter_min_index = (enter_logs.map(log => log.sec)).indexOf(Math.min(enter_logs.map(log => log.sec)));
          //let exit_max_index = (exit_logs.map(log => log.sec)).indexOf(Math.max(exit_logs.map(log => log.sec)));
          //console.log(`index: ${enter_min_index}  ${exit_max_index}`);
          let enter_stamp = extract_enter_logs[(extract_enter_logs.map(log => log.sec)).indexOf(Math.min.apply(null, extract_enter_logs.map(log => log.sec)))];
          let exit_stamp = extract_exit_logs[(extract_exit_logs.map(log => log.sec)).indexOf(Math.max.apply(null, extract_exit_logs.map(log => log.sec)))];
          console.log(`enter stamp: ${enter_stamp}`);
          console.log(`exit stamp: ${exit_stamp}`);
          let rounded_enter_time = roundCeil(new Date(enter_stamp.sec * 1000), req.body['round']);
          let rounded_exit_time = roundFloor(new Date(exit_stamp.sec * 1000), req.body['round']);
          console.log(`rounded enter stamp: ${rounded_enter_time}`);
          console.log(`rounded exit stamp: ${rounded_exit_time}`);
          //let hour = Math.floor((rounded_exit_time.getTime() - rounded_enter_time.getTime()) / (60 * 60 * 1000));
          /* Round down */
          //let min = Math.floor(((rounded_exit_time.getTime() - rounded_enter_time.getTime()) - hour * 60 * 60 * 1000) / (60 * 1000));
          //hours = `${pad(hour)}:${pad(min)}`;
          let startObj = {h: rounded_enter_time.getHours(), date: 1, hour: 0};
          let endObj = {h: rounded_exit_time.getHours(), date: 1, hour: 0};
          if(rounded_enter_time.getHours() < 6){
            //start = `${rounded_enter_time.getHours() + 24}:${pad(rounded_enter_time.getMinutes())}`;
            startObj.h += 24;
            startObj.date = 2;
            startObj.hour = 24;
          }
          else{
            //start = `${pad(rounded_enter_time.getHours())}:${pad(rounded_enter_time.getMinutes())}`;
            
          }

          if(rounded_exit_time.getHours() < 6){
            //end = `${rounded_exit_time.getHours() + 24}:${pad(rounded_exit_time.getMinutes())}`;
            endObj.h += 24
            endObj.date = 2;
            endObj.hour = 24;
          }
          else{
            //end = `${pad(rounded_exit_time.getHours())}:${pad(rounded_exit_time.getMinutes())}`;
          }
          start = `${pad(startObj.h)}:${pad(rounded_enter_time.getMinutes())}`;
          end = `${pad(endObj.h)}:${pad(rounded_exit_time.getMinutes())}`;
          console.log(`start - end: ${start} - ${end}`);
          let diff = new Date(`1970/1/${endObj.date} ${pad(endObj.h - endObj.hour)}:${pad(rounded_exit_time.getMinutes())}`).getTime() - new Date(`1970/1/${startObj.date} ${pad(startObj.h - startObj.hour)}:${pad(rounded_enter_time.getMinutes())}`).getTime();
          let hour = Math.floor(diff / (60 * 60 * 1000));
          let min = (diff - hour * 60 * 60 * 1000) / (60 * 1000);
          if(hour < 0 || min < 0){
            hour = 0;
            min = 0;
          }
          hours = `${pad(hour)}:${pad(min)}`;
          console.log(`hh:mm: ${hours}`);

        }
        else if(enter_logs.length !== 0){
          console.log(2);
          /* enter exist */
          let enter_stamp = enter_logs[(enter_logs.map(log => log.sec)).indexOf(Math.min.apply(null, enter_logs.map(log => log.sec)))];
          console.log(`enter stamp: ${enter_stamp}`);
          let rounded_enter_time = roundCeil(new Date(enter_stamp.sec * 1000), req.body['round']);
          console.log(`rounded enter stamp: ${rounded_enter_time}`);
          if(rounded_enter_time.getHours() < 6){
            start = `${rounded_enter_time.getHours() + 24}:${pad(rounded_enter_time.getMinutes())}`;
          }
          else{
            start = `${pad(rounded_enter_time.getHours())}:${pad(rounded_enter_time.getMinutes())}`;
          }
          console.log(`start: ${start}`);
        }
        else if(exit_logs.length !== 0){
           /* exit exist */
           let exit_stamp = exit_logs[(exit_logs.map(log => log.sec)).indexOf(Math.max.apply(null, exit_logs.map(log => log.sec)))];
           console.log(`exit stamp: ${exit_stamp}`);
           let rounded_exit_time = roundFloor(new Date(exit_stamp.sec * 1000), req.body['round']);
           console.log(`rounded exit stamp: ${rounded_exit_time}`);
           if(rounded_exit_time.getHours() < 6){
             end = `${rounded_exit_time.getHours() + 24}:${pad(rounded_exit_time.getMinutes())}`;
           }
           else{
             end = `${pad(rounded_exit_time.getHours())}:${pad(rounded_exit_time.getMinutes())}`;
           }
           console.log(`end: ${end}`);
        }
        else{
          // 
        }
        if(start !== '' || end !== '' || hours !== ''){
          let member = await Member.findOne({id: id}).exec();
          retured_data.push({
            id: id,
            name: member.name,
            date: date.toString(),
            start: start,
            end: end,
            hours: hours
          });
        }
      }
      
    }
    res.json(retured_data);
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
