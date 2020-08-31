// require("dotenv").config()

const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
})

fileupload = function(file, key, callback) {
    fileContent = file.buffer

    console.log(`${process.env.S3_ACCESS_KEY_ID}`)
    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: fileContent,
        ACL: process.env.S3_ACL,
    };
    
    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
        if (err) {
            if (callback) {
                callback(false, err)
            }
        } else {
            console.log(`File uploaded successfully. ${data.Location}`)
            if (callback) {
                callback(true, data.Location)
            }
        }
    });
}

module.exports = fileupload