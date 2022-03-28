const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'});
const { MongoTools, MTOptions } = require('node-mongotools');
let archiver = require('archiver');
let fs = require('fs');
let path = require('path');
require('dotenv').config();
let mongoTools = new MongoTools();
const mtOptions = {
    db: 'ddldoor',
    username: 'ddldoor',
    password: process.env.DB_PW,
    path: './'
}

(async () => {
    main();
})();

async function main() {
    console.log('Backup start!');
    console.time();
    try {
        let result = await mongoTools.mongodump(mtOptions);
        console.log(result);
        let zip_file_name = 'dump.zip'
        let archive = archiver.create('zip', {});
        let output = fs.createWriteStream(zip_file_name);
        archive.pipe(output);
        archive.glob('./dump/*');
        archive.finalize();
        output.on('close', async () => {
            s3 = new AWS.S3();
            let uploadParams = {Bucket: 'backupddldoor', Key: '', Body: ''};
            let fileStream = fs.createReadStream(zip_file_name);
            uploadParams.Body = fileStream;
            uploadParams.Key = path.basename(zip_file_name);
            let result = await s3.upload(uploadParams);
            console.log(result);
            console.timeEnd();
        });
    }
    catch(error){
        console.log(error);
    }
}