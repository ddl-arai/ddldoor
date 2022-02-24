let schedule = require('node-schedule'); 
let axios = require('axios'); 

console.log('Wait...');
schedule.scheduleJob('*/3 * * * *', function(){
    dummyWork();
});

async function dummyWork(){
    try { 
        const response = await axios.get('http://35.77.127.4/auth/dummy');
        console.log(response.status);
    } catch (error) { 
        console.log('Error!');
    } 
}