let schedule = require('node-schedule'); 
let axios = require('axios'); 

schedule.scheduleJob('*/3 * * * *', function(){
    console.log('Wait...');
    dummyWork();
});

async function dummyWork(){
    console.log('Active dummyWork')
    try { 
        const res = await axios.get('http://35.77.127.4/auth/dummy');
        console.log(res);
    } catch (error) { 
        console.log('Error!');
    } 
}