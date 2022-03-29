let axios = require('axios'); 

/* GET /door?request=(string)&devid=(number)&idm=(string)&sec=(number) */
const REQUEST = 'status';
const DEVID = 2;  // 社員用出口
const IDM = "0";  // Anything

let status = 0;
(async () => {
    while(1){
        await main();
    }
})();

function getURI(sec){
    return `http://localhost:3000/door?request=${REQUEST}&devid=${DEVID}&idm=${IDM}&sec=${sec}`;
}

async function main(){
    if(status === 0){
        console.log('close');
    }
    else if(status === 1){
        console.log('open');
    }
    else{
        console.log(status);
    }
    
    /* 3s interval */
    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await _sleep(1000);

    const now = Math.floor(Date.now() / 1000);
    const url = getURI(now); 

    try {
        const response = await axios.get(url);
        status = response.data.result;
    }
    catch(error){
        console.log(error);
    }
}