require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
const { MongoTools } = require('node-mongotools');
let fs = require('fs');
let path = require('path');
let schedule = require('node-schedule'); 
let mongoTools = new MongoTools();
const mtOptions = {
    db: 'ddldoor',
    username: 'ddldoor',
    password: process.env.DB_PW,
    path: './'
}

process.on('SIGINT', () => { 
    schedule.gracefulShutdown().then(() => {
		console.log('Schedule shutdown');
        process.exit(0);
    });
});

console.log('Welcome to backup serivce');
schedule.scheduleJob('*/1 * * * *', () => {
    main();
});

async function main() {
    console.log('Backup service start');
    console.time();
    try {
        let result = await mongoTools.mongodump(mtOptions);
        let file_name = result.fileName;
        s3 = new AWS.S3();
        let uploadParams = {Bucket: process.env.AWS_BACKET_NAME, Key: '', Body: ''};
        let fileStream = fs.createReadStream(file_name);
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file_name);
        s3.upload (uploadParams, function (err, data) {
            if(err){
              console.log("Error", err);
            } 
            if(data){
              console.log("Upload Success", data.Location);
              fileStream.destroy();
              fs.unlinkSync(file_name);
              console.timeEnd();
            }
        });
    }
    catch(error){
        console.log(error);
    }
}